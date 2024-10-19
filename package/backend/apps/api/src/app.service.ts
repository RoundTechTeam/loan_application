import { Injectable, OnModuleInit } from '@nestjs/common';
import { AiGeneratorService } from './ai-generator/ai-generator.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly aiGeneratorService: AiGeneratorService) {}
  async onModuleInit() {
    await this.aiGeneratorService.getTextFromImage();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
