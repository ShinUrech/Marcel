import * as dotenv from 'dotenv';

// Load environment variables from .env.development
const result = dotenv.config({ path: '.env.development' });
if (result.error) {
  console.error('Error loading .env.development:', result.error);
}

import { NestFactory } from '@nestjs/core';
import { ScraperModule } from './src/modules/scraper/scraper.module';
import { LINKEDIN_TARGETS } from './src/modules/scraper/services/scraping-config/target-sources.config';
import * as readline from 'readline';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import environment from './src/common/configs/environment';
import { parseCliArgs } from './src/common/utils/cli-helper';
import { ScraperService } from './src/modules/scraper/services/scraper.service';
import { ScrapingStatsService } from './src/modules/scraper/services/scraping-stats.service';

console.log('Using MONGO_URI:', process.env.MONGO_URI);

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    // Create a dynamic module to wrap everything including Config and Mongoose
    {
      module: class AppModule {},
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
          load: [environment],
        }),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: process.env.MONGO_URI,
          }),
        }),
        ScraperModule,
      ],
    },
  );
  const scraperService = app.get(ScraperService);
  const scrapingStatsService = app.get(ScrapingStatsService);

  // Check for command line argument
  const args = process.argv.slice(2);
  const { scrapeAll, fromDate, targetArg } = parseCliArgs(args);

  if (targetArg) {
    console.log(`Using target from command line: ${targetArg}`);
    const target = LINKEDIN_TARGETS.find((t) => t.name.toLowerCase().includes(targetArg.toLowerCase()));

    if (target) {
      const companyName = target.url.split('company/')[1].replace('/', '');
      console.log(`Starting scrape for: ${target.name} (${companyName})`);

      await scraperService.getAllLinkedInArticles(companyName, fromDate);

      scrapingStatsService.printStats();
      process.exit(0);
    } else {
      console.error(`Target '${targetArg}' not found.`);
      process.exit(1);
    }
  } else if (scrapeAll) {
    // If only --all is provided, scrape all targets
    console.log('Scraping ALL targets with --all flag...');
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (scrapeAll && !targetArg) {
    // Auto-select "all"
    console.log('Auto-selecting ALL targets due to --all flag.');
    await runScrapingLoop(LINKEDIN_TARGETS, scraperService, fromDate);
    scrapingStatsService.printStats();
    await app.close();
    rl.close();
    process.exit(0);
  }

  console.log('Available LinkedIn Targets:');
  LINKEDIN_TARGETS.forEach((target, index) => {
    console.log(`${index + 1}. ${target.name} (${target.url})`);
  });

  rl.question('Enter the number of LinkedIn accounts to scrape (or "all" for all): ', async (answer) => {
    let count = LINKEDIN_TARGETS.length;
    if (answer.toLowerCase() !== 'all') {
      const parsed = parseInt(answer, 10);
      if (!isNaN(parsed) && parsed > 0) {
        count = parsed;
      }
    }

    console.log(`Starting scrape for first ${count} LinkedIn accounts...`);
    const targetsToScrape = LINKEDIN_TARGETS.slice(0, count);
    await runScrapingLoop(targetsToScrape, scraperService, fromDate);

    console.log('\nScraping session complete.');
    scrapingStatsService.printStats();
    await app.close();
    rl.close();
    process.exit(0);
  });
}

async function runScrapingLoop(targets: any[], scraperService: ScraperService, fromDate?: Date) {
  for (const target of targets) {
    console.log(`\n--- Scraping LinkedIn: ${target.name} ---`);
    try {
      // Extract company name from URL or use name if appropriate
      // The config url is like 'linkedin.com/company/swissrail'
      // We need 'swissrail'
      const companyName = target.url.split('linkedin.com/company/')[1]?.replace(/\/$/, '');

      if (companyName) {
        await scraperService.getAllLinkedInArticles(companyName, fromDate);
      } else {
        console.warn(`Could not extract company name from URL: ${target.url}`);
      }
    } catch (error) {
      console.error(`Error scraping ${target.name}:`, error.message);
    }
  }
}

bootstrap();
