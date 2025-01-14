import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { lookup } from 'mime-types';
import { db } from '~api/db';
export interface UploadFileReq<T> {
  storage: S3Client;
  url: NodeJS.ProcessEnv['S3_CDN_URL'];
  bucket: NodeJS.ProcessEnv['S3_CDN_BUCKET'];
  path: string;
  file: T;
  fileName?: string;
}

export type DeleteFileReq = Pick<
  UploadFileReq<any>,
  'path' | 'storage' | 'bucket'
>;

@Injectable()
export class StorageService {
  public readonly cdnStorage: S3Client;

  constructor() {
    this.cdnStorage = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      endpoint: process.env.S3_CDN_ENDPOINT,
      region: 'auto',
      forcePathStyle: true,
    });
  }

  async uploadBuffer(req: UploadFileReq<Buffer>, cache = true) {
    const url = `${req.url}/${req.path}`;
    const params = new PutObjectCommand({
      Bucket: req.bucket,
      Key: req.path,
      Body: req.file,
      ContentType: lookup(req.fileName) || 'application/octet-stream',
      CacheControl: cache ? 'max-age=31536000' : undefined,
    });
    await req.storage.send(params);
    await await db.file.create({
      data: {
        path: req.path,
        size: Buffer.byteLength(req.file),
        url: url,
      },
    });
    return url;
  }

  async delete(req: DeleteFileReq) {
    const params = new DeleteObjectCommand({
      Bucket: req.bucket,
      Key: req.path,
    });
    await req.storage.send(params);
  }
}
