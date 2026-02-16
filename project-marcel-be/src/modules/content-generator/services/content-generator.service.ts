/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import OpenAI from 'openai';
import { formatHtmlVideo } from 'src/common/utils/format-html';
import { getInnerBody } from 'src/common/utils/get-inner-body';
import { ArticlesService } from 'src/modules/scraper/services/articles.service';
// import { imageSize } from 'image-size';
// import * as path from 'path';
// import { readFileSync } from 'fs';
// import { isLargeImg } from 'src/common/utils/enhance-image';
import getImage from 'src/common/helpers/search-image-google';
import { downloadImage } from 'src/common/helpers/download-image';
@Injectable()
export class ContentGeneratorService {
  constructor(
    private readonly config: ConfigService,
    private articlesService: ArticlesService,
  ) {}

  async generateArticleRequest(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this article and generate a different version: "${originalArticle}"`;
    try {
      const response: any = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Generated Article:', response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }
  async generateArticle(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this article and generate a different version: "${originalArticle}"`;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: prompt }],
    });

    return (await completion).choices[0].message.content;
  }

  async createArticleContent(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Generate new content from this article after cleaning and removing unnecessary text and the result is html inner body only : "${originalArticle}"`;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: prompt }],
    });

    return (await completion).choices[0].message.content;
  }

  async createArticleTeaser(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this article after cleaning and removing unnecessary text in 2 to 3 lines max : "${originalArticle}"`;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: prompt }],
    });

    return (await completion).choices[0].message.content;
  }

  async createImageTitleContext(originalArticle) {
    const API_KEY = this.config.get('chatGPT');
    const prompt = `Summarize this in English in 3 or 2 words for short image search : "${originalArticle}"`;

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [{ role: 'user', content: prompt }],
    });

    return (await completion).choices[0].message.content;
  }

  async createArticleVideo(youtubeVideoLink) {
    const API_KEY = this.config.get('chatGPT');

    const openai = new OpenAI({
      apiKey: API_KEY,
    });

    const completion = openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that summarizes YouTube videos in HTML format.',
        },
        {
          role: 'user',
          content: `Summarize the video at ${youtubeVideoLink} in 3-4 paragraphs, providing a title. The output should be valid HTML inside the <body> tag.`,
        },
      ],
    });

    return (await completion).choices[0].message.content;
  }

  async generateImageTitleContext() {
    const articles = await this.articlesService.findNoImageTitleContext();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      console.log(`--->> Article ${index} of ${articles.length} : ${article.title}`);
      const imageTitleContext = await this.createImageTitleContext(article.originalContent);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('---->>>>>> Title: ', imageTitleContext);
      article.imageTitleContext = imageTitleContext;
      await this.articlesService.updateImageTitleContext(article.id, imageTitleContext);
    }
    return articles;
  }

  async generateContent() {
    const articles = await this.articlesService.findNoContent();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      console.log(`------->>>> Article ${index} of ${articles.length} : ${article.title}`);
      const content = await this.createArticleContent(article.originalContent);
      // console.log(`-->>  Result: `, content);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const generatedContent = getInnerBody(content);
      article.generatedContent = generatedContent;
      await this.articlesService.updateContent(article.id, generatedContent);
    }
    return articles;
  }

  async generateTeaser() {
    const articles = await this.articlesService.findNoTeaser();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      console.log(`---> Article ${index} of ${articles.length} : ${article.title}`);
      const teaser = await this.createArticleTeaser(article.originalContent);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      article.teaser = teaser;
      await this.articlesService.updateTeaser(article.id, teaser);
    }
    return articles;
  }

  async generateYoutubeSummary() {
    const articles = await this.articlesService.findVideoNoSummary();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      console.log(`------->>>> Article ${index} of ${articles.length} : ${article.title}`);
      const content = await this.createArticleVideo(article.url);
      console.log(`-->>  Result: `, content);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const generatedContent = getInnerBody(content);
      article.generatedContent = formatHtmlVideo(generatedContent);
      await this.articlesService.updateContent(article.id, formatHtmlVideo(generatedContent));
    }
    return articles;
  }

  async generateGoogleImage() {
    const articles = await this.articlesService.findNewsNoGoogleImages();
    let imgIdx = 0;
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      if (article.imageTitleContext && !article.imageLocal) {
        imgIdx++;
        console.log(`(${imgIdx})---> I should Search for: ${article.imageTitleContext}`);
        const { url, width, height } = await getImage(article.imageTitleContext);
        const filename = await downloadImage(url);
        console.log('-----> New Image Dimensions: ', width, height);
        await this.articlesService.findAndUpdateGoogleImage(article._id, filename);
      }
    }
    return articles;
  }
}
