/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleType } from 'src/models/articles.models';
import { PaginationDto } from '../dtos/pagination.dto';
import { SearchArticleDto } from '../dtos/search-article.dto';
import { join } from 'path';
import { existsSync } from 'fs';
import { Response } from 'express';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    // Fetch paginated articles
    const articles = await this.articleModel
      .find({ type: { $eq: 'News' } })
      .sort({ date: -1 }) // Sort by latest
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count
    const total = await this.articleModel.countDocuments({ type: { $eq: 'News' } });

    return {
      data: articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async findAllVideos(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    // Fetch paginated articles
    const articles = await this.articleModel
      .find({ type: { $eq: 'Video' } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count
    const total = await this.articleModel.countDocuments({ type: { $eq: 'Video' } });

    return {
      data: articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  async findAllLinkedIns(paginationDto: PaginationDto) {
    const { page } = paginationDto;
    const limit = 9;
    const skip = (page - 1) * limit;

    // Fetch paginated articles
    const articles = await this.articleModel
      .find({ type: { $eq: 'LinkedIn' } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Get total count
    const total = await this.articleModel.countDocuments({ type: { $eq: 'LinkedIn' } });

    return {
      data: articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  // async findAllLinkedIns(paginationDto: PaginationDto) {
  //   const { page } = paginationDto;
  //   const limit = 9;
  //   const skip = (page - 1) * limit;

  //   const articles = await this.articleModel
  //     .aggregate([
  //       { $match: { type: 'LinkedIn' } },
  //       {
  //         $addFields: {
  //           dateOnly: {
  //             $dateToString: { format: '%Y-%m-%d', date: '$date' },
  //           },
  //           randomValue: { $rand: {} },
  //         },
  //       },
  //       {
  //         $sort: {
  //           dateOnly: -1,
  //           randomValue: 1,
  //         },
  //       },
  //       {
  //         $project: {
  //           dateOnly: 0,
  //           randomValue: 0,
  //         },
  //       },
  //       { $skip: skip },
  //       { $limit: limit },
  //     ])
  //     .exec();

  //   const total = await this.articleModel.countDocuments({ type: 'LinkedIn' });

  //   return {
  //     data: articles,
  //     currentPage: page,
  //     totalPages: Math.ceil(total / limit),
  //     totalItems: total,
  //   };
  // }

  // async findAllLinkedIns(paginationDto: PaginationDto) {
  //   const { page } = paginationDto;
  //   const limit = 9;
  //   const fetchLimit = limit * 5; // Fetch more than needed to ensure good mixing

  //   // Step 1: Fetch sorted articles
  //   const allArticles = await this.articleModel.find({ type: 'LinkedIn' }).sort({ date: -1 }).limit(fetchLimit).exec();
  //   // console.log('----> allArticles', allArticles);
  //   // Step 2: Group by baseUrl
  //   const grouped: Record<string, any[]> = {};
  //   for (const article of allArticles) {
  //     const key = article.baseUrl;
  //     if (!grouped[key]) grouped[key] = [];
  //     grouped[key].push(article);
  //   }
  //   console.log('--> grouped', grouped.length);
  //   // Step 3: Interleave up to 3 per group at a time
  //   const mixed: any[] = [];
  //   let stillHasArticles = true;

  //   while (stillHasArticles && mixed.length < fetchLimit) {
  //     stillHasArticles = false;
  //     for (const key of Object.keys(grouped)) {
  //       const group = grouped[key];
  //       const chunk = group.splice(0, 3);
  //       mixed.push(...chunk);
  //       if (group.length > 0) {
  //         stillHasArticles = true;
  //       }
  //     }
  //   }

  //   // Step 4: Apply pagination
  //   const start = (page - 1) * limit;
  //   const paginated = mixed.slice(start, start + limit);

  //   const total = await this.articleModel.countDocuments({ type: 'LinkedIn' });

  //   return {
  //     data: paginated,
  //     currentPage: page,
  //     totalPages: Math.ceil(total / limit),
  //     totalItems: total,
  //   };
  // }

  findAllTest() {
    return this.articleModel.find({ dateText: { $ne: 'N/A' } });
  }

  findAllBeforeDate(beforeDate: Date) {
    return this.articleModel.find({ date: { $lt: beforeDate }, type: { $eq: ArticleType.News } });
  }

  findAllVideo() {
    return this.articleModel.find({ type: { $eq: 'Video' } });
  }

  findAllLinkedIn() {
    return this.articleModel.find({ type: { $eq: 'LinkedIn' } });
  }

  findOne(id: string) {
    return this.articleModel.findOne({ _id: id });
  }

  // 🔍 Separate Search API
  async searchArticles(searchDto: SearchArticleDto) {
    const { query, page, limit } = searchDto;
    const skip = (page - 1) * limit;

    if (!query) {
      return { data: [], message: 'No search query provided' };
    }

    const filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { generatedContent: { $regex: query, $options: 'i' } },
        { originalContent: { $regex: query, $options: 'i' } },
      ],
    };

    const articles = await this.articleModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit).exec();

    // Get total count
    const total = await this.articleModel.countDocuments(filter);

    return {
      data: articles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  getFileByName(fileName: string, res: Response) {
    const defaultFileImage = 'default-placeholder.png';
    try {
      if (fileName && fileName.indexOf('.') !== -1) {
        const filePath = join(process.cwd(), 'public', fileName);
        if (existsSync(filePath)) {
          return res.sendFile(filePath);
        } else {
          throw new Error();
        }
      } else {
        throw new Error();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const filePath = join(process.cwd(), 'public', defaultFileImage);
      return res.sendFile(filePath);
    }
  }

  async emptyAllArticlesTeaser() {
    const articles = await this.articleModel.find();
    for (const article of articles) {
      article.teaser = null;
      await article.save();
    }
  }

  async getRandomArticles(type: ArticleType) {
    try {
      const randomVideoArticles = await this.articleModel.aggregate([
        { $match: { type: type } },
        { $sample: { size: 4 } },
      ]);

      if (randomVideoArticles.length > 0) {
        return randomVideoArticles; // Return the array of random video articles
      } else {
        console.log('No video articles found.');
        return [];
      }
    } catch (error) {
      console.error('Error fetching random video articles:', error);
      throw new Error('Failed to fetch random video articles');
    }
  }
}
