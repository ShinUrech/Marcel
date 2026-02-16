/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ContentGeneratorService } from './services/content-generator.service';
import { ScraperModule } from '../scraper/scraper.module';
import { ContentGeneratorController } from './controllers/content-generator.controller';

@Module({
  providers: [ContentGeneratorService],
  exports: [ContentGeneratorService],
  imports: [ScraperModule],
  controllers: [ContentGeneratorController],
})
export class ContentGeneratorModule {}
