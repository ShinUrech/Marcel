/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ScraperService } from '../services/scraper.service';
import { ScraperDeeperService } from '../services/scraper-deeper.service';
import { ArticlesService } from '../services/articles.service';
import { enhanceImage } from 'src/common/utils/enhance-image';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly scraperDeeperService: ScraperDeeperService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Get('test')
  async getTEST() {
    // const pageUrl = 'https://proalps.ch/mm_31-jahre-volks-ja/';
    // return this.scraperDeeperService.getRoalpsArticle(pageUrl);
    // return this.scraperService.getAllLinkedInArticles();

    const filePath = 'image-1742301133248.jpg';
    await enhanceImage(filePath);
    return 'Okay';
  }

  @Get('download')
  async getImages() {
    return this.articlesService.downloadImages();
  }

  @Get('formateDates')
  async formateDates() {
    return this.articlesService.formateDates();
  }

  @Get('linkedin/:company')
  async getCompanyPost(@Param('company') companyName: string) {
    return this.scraperService.getAllLinkedInArticles(companyName);
  }

  // Rail-only YouTube channels
  @Get('youtube/:channelName')
  async getRailVideos(@Param('channelName') channelName: string) {
    return this.scraperService.getAllVideos(channelName);
  }

  @Get('youtube/:channelName/:term')
  async getRailVideosFromSearch(@Param('channelName') channelName: string, @Param('term') term: string) {
    return this.scraperService.getAllVideosFromSearch(channelName, term);
  }

  // Scrape all rail sources (for cron / manual trigger)
  @Get('scrape-all')
  async scrapeAllRailSources() {
    return this.scraperService.scrapeAllRailSources();
  }
}
