import { Injectable } from '@nestjs/common';
import fs from 'fs/promises';
import OpenAI from 'openai';
import path from 'path';
import pdfPoppler from 'pdf-poppler';
import Tesseract, { RecognizeResult } from 'tesseract.js';

@Injectable()
export class AiGeneratorService {
  async getTextFromImage() {
    const fileName = path.resolve(
      __dirname,
      `../../../../backend/apps/api/src/ai-generator/image/SSMReport.pdf`,
    );

    const images = [];

    const outDirectory = path.resolve(
      __dirname,
      `../../../../backend/apps/api/src/ai-generator/image/generator-image`,
    );

    if (fileName.endsWith('.pdf')) {
      const newFileName = path.basename(fileName, path.extname(fileName));

      const opts = {
        format: 'png',
        out_dir: outDirectory,
        out_prefix: newFileName,
        page: null,
      };

      await pdfPoppler.convert(fileName, opts).then(async () => {
        for (let i = 0; i < 15; i++) {
          const fileName = path.resolve(
            __dirname,
            `../../../../backend/apps/api/src/ai-generator/image/generator-image/${newFileName}-${
              i + 1
            }.png`,
          );

          await fs
            .access(fileName, fs.constants.F_OK)
            .then(() => {
              images.push(fileName);
            })
            .catch(() => {
              console.log('file not found');
            });
        }
      });
    } else {
      images.push(fileName);
    }

    const textToSubmit = [];

    for (const image of images) {
      await Tesseract.recognize(
        image,
        'eng', // Use English language
      ).then(async (result: RecognizeResult) => {
        console.log(result.data.text);
        textToSubmit.push(result.data.text);
      });
    }

    // await this.sendToChatGpt(textToSubmit.join(','));
  }

  // async sendTogGroq(text: string) {
  //   const groq = new Groq({
  //     apiKey: process.env.GROQ_API_KEY,
  //   });

  //   const importantInfo = [
  //     'Company Name',
  //     'Company Incorporation Date',
  //     'Company Type',
  //     'Retain Earning',
  //     'Revenue',
  //   ];

  //   let completion;
  //   const aiModels = ['gemma2-9b-it', 'llama3-8b-8192'];
  //   let count = 0;
  //   const maxTries = 2;
  //   while (count < 2) {
  //     try {
  //       completion = await groq.chat.completions.create({
  //         temperature: 0.5,
  //         // response_format: {
  //         //   type: 'json_object',
  //         // },
  //         messages: [
  //           {
  //             role: 'system',
  //             content: `
  //                 You are an AI assistant that help to find the important information from the ${text}.

  //                 ##Important
  //                 I have few important information that I need to get from the ${text}.
  //                 ${importantInfo.map((info) => `1. ${info}`).join('\n')}

  //                 ##Response
  //                 Please provide me the important information from the ${text}.

  //                 ##Result
  //                 Here is the result:
  //                  'Company Name': '',
  //                  'Company Incorporation Date': '',
  //                  'Company Type': '',
  //                  'Retain Earning': '',
  //                  'Revenue': '',
  //                 `,
  //           },
  //         ],
  //         model: aiModels[count],
  //       });

  //       console.log(completion.choices[0].message.content);

  //       if (completion) return completion.choices[0].message.content as string;
  //     } catch (e) {
  //       count = count + 1;
  //       if (count === maxTries) throw e;
  //     }
  //   }
  //   if (!completion) return;
  // }

  async sendToChatGpt(text: string) {
    const openai = new OpenAI({
      defaultHeaders: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const importantInfo = [
      'Company Name',
      'Company Incorporation Date',
      'Company Type',
      'Retain Earning',
      'Revenue',
    ];

    const content = `
                     You are an AI assistant that help to find the important information from the ${text}.
  
                     ##Important
                     I have few important information that I need to get from the ${text}.
                     ${importantInfo.map((info) => `1. ${info}`).join('\n')}
  
                     ##Response
                     Please provide me the important information from the ${text}.
  
                     ##Result
                     Here is the result:
                      'Company Name': '',
                      'Company Incorporation Date': '',
                      'Company Type': '',
                      'Retain Earning': '',
                      'Revenue': '',
                    `;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: content }],
      stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  }
}
