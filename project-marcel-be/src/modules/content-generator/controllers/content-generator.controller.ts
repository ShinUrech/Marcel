/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { ContentGeneratorService } from '../services/content-generator.service';

@Controller('content-generator')
export class ContentGeneratorController {
  constructor(private contentGeneratorService: ContentGeneratorService) {}

  @Get('content')
  async getContent() {
    return this.contentGeneratorService.generateContent();
  }

  @Get('teaser')
  async getTeaser() {
    return this.contentGeneratorService.generateTeaser();
  }

  @Get('video')
  async getVideo() {
    return this.contentGeneratorService.generateYoutubeSummary();
  }

  @Get('image-title')
  async getImageTitle() {
    return this.contentGeneratorService.generateImageTitleContext();
  }

  @Get('better-images')
  async getBetterImages() {
    return this.contentGeneratorService.generateGoogleImage();
  }
}
