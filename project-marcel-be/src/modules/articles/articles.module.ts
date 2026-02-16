/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ArticlesController } from './controllers/articles.controller';
import { ArticlesService } from './services/articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/models/articles.models';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
})
export class ArticlesModule {}
