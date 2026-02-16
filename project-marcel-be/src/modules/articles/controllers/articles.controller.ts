/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaginationDto } from '../dtos/pagination.dto';
import { ArticlesService } from '../services/articles.service';
import { SearchArticleDto } from '../dtos/search-article.dto';
import { parseRelativeDateLinkedIn } from 'src/common/utils/format-date';
import { ArticleType } from 'src/models/articles.models';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticles(@Query() paginationDto: PaginationDto) {
    return this.articleService.findAll(paginationDto);
  }

  @Get('/videos')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticlesVideo(@Query() paginationDto: PaginationDto) {
    return this.articleService.findAllVideos(paginationDto);
  }

  @Get('/linkedin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getArticlesLinkedin(@Query() paginationDto: PaginationDto) {
    return this.articleService.findAllLinkedIns(paginationDto);
  }

  @Get('/vrandom')
  async getRandomVideoArticles() {
    return this.articleService.getRandomArticles(ArticleType.Video);
  }

  @Get('/nrandom')
  async getRandomNewsArticles() {
    return this.articleService.getRandomArticles(ArticleType.News);
  }

  // 🔍 Separate Search API
  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchArticles(@Query() searchDto: SearchArticleDto) {
    return this.articleService.searchArticles(searchDto);
  }

  @Get('/test')
  async getTestDate() {
    const articles = await this.articleService.findAllLinkedIn();
    const formattedDates = articles.map((item) => ({
      original: item.dateText,
      formatted: parseRelativeDateLinkedIn(item.dateText),
    }));
    return formattedDates;
  }

  @Get('/date')
  async getDate() {
    const beforeDate = new Date('2024-06-01');
    const articles = await this.articleService.findAllBeforeDate(beforeDate);

    return articles;
  }

  @Get('/:id')
  async getArticle(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Get('/show/:fileName')
  async getFile(@Param('fileName') fileName: string, @Response() res) {
    return this.articleService.getFileByName(fileName, res);
  }
}
