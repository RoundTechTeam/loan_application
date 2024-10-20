import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { lookup } from 'mime-types';
import short from 'short-unique-id';
import { PublicRoute } from '~api/guards/jwt.guard';
import { StorageService } from '~api/storage/storage.service';
import { GetUser } from '~api/utils/decorators';
import { UserWithoutPassword } from '~libs/entities';
import { slugify } from '~libs/helpers';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 3))
  async upload(
    @GetUser() user: UserWithoutPassword,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|pdf|doc|docx)/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 ** 2,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uuid = new short({ length: 10 });

    const urls = await Promise.all(
      files.map(async (file) => {
        const fileName = file.originalname.split('.');
        const fileExtension = fileName[fileName.length - 1].toLowerCase();

        const path = `${user.id}/${slugify(
          fileName[0],
        ).toLowerCase()}-${uuid()}.${fileExtension}`;
        const url = `${process.env.S3_CDN_URL}/${path}`;

        try {
          await this.storageService.uploadBuffer(
            {
              storage: this.storageService.cdnStorage,
              url: process.env.S3_CDN_URL,
              bucket: process.env.S3_CDN_BUCKET,
              path: path.trim(),
              file: file.buffer,
              fileName: file.originalname,
            },
            true,
          );

          return url;
        } catch (e) {
          console.log('e', e);
        }
      }),
    );

    return urls;
  }

  @Post('/bill-receipt/:alias')
  @PublicRoute()
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadBillReceipt(
    @Param('alias') alias: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|pdf|doc|docx)/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 ** 2,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const uuid = new short({ length: 10 });

    const urls = await Promise.all(
      files.map(async (file) => {
        const fileName = file.originalname.split('.');

        const path = `${alias}/${slugify(
          fileName[0],
        ).toLowerCase()}-${uuid()}.${fileName[1]}`;
        const url = `${process.env.S3_CDN_URL}/${path}`;

        await this.storageService.uploadBuffer(
          {
            storage: this.storageService.cdnStorage,
            url: process.env.S3_CDN_URL,
            bucket: process.env.S3_CDN_BUCKET,
            path: path,
            file: file.buffer,
            fileName: file.originalname,
          },
          true,
        );

        return url;
      }),
    );

    return urls;
  }

  @Get()
  async downloadImage(@Query('url') url: string) {
    if (!url.includes('carijob.asia')) {
      throw new Error('Invalid file url');
    }

    const head = await axios.head(url);
    const contentType = head.headers['content-type'];
    const contentLength = head.headers['content-length'];
    if (!contentType.startsWith('image')) {
      throw new Error('Invalid file type');
    }
    if (!contentLength) {
      throw new Error('Invalid file size');
    }
    if (Number(contentLength) > 3.5 * 1024 ** 2) {
      throw new Error('File too large');
    }

    const image = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(image.data).toString('base64');
    return `data:image/${lookup(url)};base64,${base64}`;
  }
}
