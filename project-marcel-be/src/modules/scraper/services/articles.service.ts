/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleType } from 'src/models/articles.models';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { formatDate, parseRelativeDate, parseRelativeDateLinkedIn } from 'src/common/utils/format-date';
import { nanoid } from 'nanoid';
import { formatHtmlLinkedIn } from 'src/common/utils/format-html';
import { enhanceImage } from 'src/common/utils/enhance-image';
import { downloadImage } from 'src/common/helpers/download-image';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async createArticle(article: CreateArticleDto) {
    if (article.type !== ArticleType.LinkedIn) {
      const existingArticle = await this.articleModel.findOne({ url: article.url });

      if (existingArticle) {
        return null;
      }

      const newArticle = new this.articleModel(article);
      return newArticle.save();
    } else {
      article.url = `(${nanoid()})-${article.baseUrl}`;
      article.originalContent = formatHtmlLinkedIn(article.originalContent);
      const existingArticle = await this.articleModel.findOne({ originalContent: article.originalContent });
      if (existingArticle) {
        return null;
      }

      const newArticle = new this.articleModel(article);
      return newArticle.save();
    }
  }

  findAll() {
    return this.articleModel.find();
  }

  findNoContent() {
    return this.articleModel
      .find({
        $and: [
          {
            $or: [{ generatedContent: { $exists: false } }, { generatedContent: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      })
      .sort({ date: -1 })
      .exec();
  }

  findNoImageTitleContext() {
    return this.articleModel
      .find({
        $and: [
          {
            $or: [{ imageTitleContext: { $exists: false } }, { imageTitleContext: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      })
      .sort({ date: -1 })
      .exec();
  }

  findNoTeaser() {
    return this.articleModel
      .find({
        $and: [
          {
            $or: [{ generatedTeaser: { $exists: false } }, { generatedTeaser: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      })
      .sort({ date: -1 })
      .exec();
  }

  findNewsNoGoogleImages() {
    return this.articleModel
      .find({
        $and: [
          {
            $or: [{ googleImage: { $exists: false } }, { googleImage: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      })
      .sort({ date: -1 })
      .exec();
  }

  findVideoNoSummary() {
    return this.articleModel
      .find({
        $and: [
          {
            $or: [{ generatedContent: { $exists: false } }, { generatedContent: { $eq: '' } }],
          },
          { type: ArticleType.Video },
        ],
      })
      .sort({ date: -1 })
      .exec();
  }

  FindOne(id: string) {
    return this.articleModel.findOne({ _id: id });
  }

  Update(id: string, article) {
    return this.articleModel.findByIdAndUpdate({ _id: id }, { $set: article }, { new: true });
  }

  updateContent(id: string, generatedContent: string) {
    return this.articleModel.findOneAndUpdate({ _id: id }, { $set: { generatedContent } }, { new: true });
  }

  updateTeaser(id: string, generatedTeaser: string) {
    return this.articleModel.findOneAndUpdate({ _id: id }, { $set: { generatedTeaser } }, { new: true });
  }

  updateImageTitleContext(id: string, imageTitleContext: string) {
    return this.articleModel.findOneAndUpdate({ _id: id }, { $set: { imageTitleContext } }, { new: true });
  }

  Delete(id: string) {
    return this.articleModel.deleteOne({ _id: id });
  }

  async downloadImages() {
    const articles = await this.articleModel.find();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];

      if (article.image && article.image !== 'N/A') {
        const imageUrl = article.image;
        try {
          const filename = await downloadImage(imageUrl);
          // Enhance Image
          try {
            const outputName = await enhanceImage(filename);

            await this.articleModel.findOneAndUpdate(
              { _id: article._id },
              { $set: { imageLocal: outputName } },
              { new: true },
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            console.log('---> error', error);
            await this.articleModel.findOneAndUpdate(
              { _id: article._id },
              { $set: { imageLocal: filename } },
              { new: true },
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.log(`Error downloading image: ${article.image} ,Error ${error}`);
          console.log(`Error ${error}`);
        }
      }
    }
  }

  async findAndUpdateGoogleImage(id, filename) {
    return this.articleModel.findOneAndUpdate({ _id: id }, { $set: { googleImage: filename } }, { new: true });
  }

  async formateDates() {
    const articles = await this.articleModel.find({
      $or: [{ date: { $exists: false } }, { date: { $eq: '' } }],
    });
    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null;

      const parts = dateString.split('/'); // Split "28/01/2025" -> ["28", "01", "2025"]
      if (parts.length !== 3) return null;

      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day); // month - 1 because JavaScript months are 0-based
    };

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      try {
        if (article.dateText !== 'N/A') {
          if (article.type === 'News') {
            const dateString = formatDate(article.dateText);
            const formatted = parseDate(dateString);
            await this.articleModel.findOneAndUpdate(
              { _id: article._id },
              { $set: { date: formatted } },
              { new: true },
            );
          }
          if (article.type === 'Video') {
            const formatted = parseRelativeDate(article.dateText);
            await this.articleModel.findOneAndUpdate(
              { _id: article._id },
              { $set: { date: formatted } },
              { new: true },
            );
          }

          if (article.type === 'LinkedIn') {
            const formatted = parseRelativeDateLinkedIn(article.dateText);
            await this.articleModel.findOneAndUpdate(
              { _id: article._id },
              { $set: { date: formatted } },
              { new: true },
            );
          }
        } else {
          await this.articleModel.findOneAndUpdate({ _id: article._id }, { $set: { date: new Date() } }, { new: true });
        }
      } catch (error) {
        console.log('--> ', error);
      }
    }
  }
}
