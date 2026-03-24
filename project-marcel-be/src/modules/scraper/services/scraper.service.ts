/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getAllVideos, getAllVideosFromSearch } from './scraping-scripts/youtube.script';
import { getAllRoalpsArticles } from './scraping-scripts/roalps.script';
import { getAllSevOnlineArticles } from './scraping-scripts/sev-online.script';
import { getAllOtifArticles } from './scraping-scripts/otif.script';
import { getAllCitrapArticles } from './scraping-scripts/citrap-vaud.script';
import { getAllBernmobilArticles } from './scraping-scripts/bernmobil.script';
import { getAllBahnberufeArticles } from './scraping-scripts/bahnberufe.script';
import { getAllLokReportArticles } from './scraping-scripts/lok-report.script';
import { getAllRailMarketArticles } from './scraping-scripts/railmarket.script';
import { getAllBaublattArticles } from './scraping-scripts/baublatt.script';
import { getAllProBahnArticles } from './scraping-scripts/pro-bahn.script';
import { getAllPressEportalArticles, getAllPressePortalEmArticles } from './scraping-scripts/presseportal.script';
import { getAllBahnBlogArticles } from './scraping-scripts/bahnblogstelle.script';
import { getAllLinkedInArticles } from './scraping-scripts/linkedIn.script';
import { getAllHupacArticles } from './scraping-scripts/hupac.script';
import { getAllDoppelArticles } from './scraping-scripts/doppelmayr.script';
import { getAllAarglArticles } from './scraping-scripts/aargauverkehr.script';
import { getAllVvlArticles } from './scraping-scripts/vvl.script';
import { getAllRbslArticles } from './scraping-scripts/rbs.script';
import { getAllCstlArticles } from './scraping-scripts/cst.script';
import { getAllCarGorailArticles } from './scraping-scripts/cargorail.script';
import { getAllZentralBahnArticles } from './scraping-scripts/zentralbahn.script';
import { getAllVoevArticles } from './scraping-scripts/voev.script';
import { getAllStadtArticles } from './scraping-scripts/stadt-zuerich.script';
import { getAllZvvArticles } from './scraping-scripts/zvv.script';
import { getAllAlstomArticles } from './scraping-scripts/alstom.script';
import { getAllAbbArticles } from './scraping-scripts/abb.script';
import { getAllRhombergArticles } from './scraping-scripts/rhomberg-sersa.script';
import { getAllBlsAdArticles, getAllBlsArticles } from './scraping-scripts/bls.script';
import { getAllSbbCargoArticles } from './scraping-scripts/sbbcargo.script';
import {
  getAllMuellerFrauenNewsArticles,
  getAllMuellerFrauenVideosArticles,
} from './scraping-scripts/mueller-frauenfeld.script';
import { getAllCVanoliArticles } from './scraping-scripts/c-vanoli.script';
import { getAllRhbNewsArticles, getAllRhbProjectArticles } from './scraping-scripts/rhb.script';
import { getAllSobArticles } from './scraping-scripts/sob.script';
import { ArticlesService } from './articles.service';
import { ScraperDeeperService } from './scraper-deeper.service';

@Injectable()
export class ScraperService {
  constructor(
    private articlesService: ArticlesService,
    private scraperDeeperService: ScraperDeeperService,
  ) {}

  //**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT
  async getAllVideos(channelName: string): Promise<any[]> {
    const articles = await getAllVideos(channelName);
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      if (article.title !== 'N/A') {
        await this.articlesService.createArticle(article);
      }
    }
    return articles;
  }
  //**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT WITH SEARCH
  async getAllVideosFromSearch(channelName: string, term: string): Promise<any[]> {
    const articles = await getAllVideosFromSearch(channelName, term);
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      if (article.title !== 'N/A') {
        await this.articlesService.createArticle(article);
      }
    }
    return articles;
  }
  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getAllRoalpsArticles() {
    const articles = await getAllRoalpsArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRoalpsArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }
  //**/ NOTE: "sev-online.ch/" SCRAPPING SCRIPT
  async getAllSevOnlineArticles() {
    const articles = await getAllSevOnlineArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getSevOnlineArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "otif.org/" SCRAPPING SCRIPT
  // NOTE: PDF
  async getAllOtifArticles() {
    const articles = await getAllOtifArticles();

    for (let index = 0; index < 2; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getOtifArticle(article.url);
      // await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "citrap-vaud.ch/" SCRAPPING SCRIPT
  async getAllCitrapArticles() {
    const articles = await getAllCitrapArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getCitrapArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "bernmobil.ch/" SCRAPPING SCRIPT
  async getAllBernmobilArticles() {
    const articles = await getAllBernmobilArticles();

    for (let index = 0; index < 6; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBernmobilArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "bahnberufe.de/" SCRAPPING SCRIPT
  async getAllBahnberufeArticles() {
    const articles = await getAllBahnberufeArticles();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBahnberufeArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "lok-report.de/" SCRAPPING SCRIPT
  async getAllLokReportArticles() {
    const articles = await getAllLokReportArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getLokReportArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "railmarket.com/" SCRAPPING SCRIPT
  async getAllRailMarketArticles() {
    const articles = await getAllRailMarketArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRailMarketArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "baublatt.ch/" SCRAPPING SCRIPT
  async getAllBaublattArticles() {
    const articles = await getAllBaublattArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBaublattArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "pro-bahn.ch/" SCRAPPING SCRIPT
  async getAllProBahnArticles() {
    const articles = await getAllProBahnArticles();

    for (let index = 0; index < 4; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getProBahnArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
  async getAllPressEportalArticles() {
    const articles = await getAllPressEportalArticles();

    for (let index = 0; index < 8; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getPressEportalArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "bahnblogstelle.com/" SCRAPPING SCRIPT
  async getAllBahnBlogArticles() {
    const articles = await getAllBahnBlogArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBahnBlogArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT
  async getAllLinkedInArticles(companyName: string) {
    const articles = await getAllLinkedInArticles(companyName);

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "hupac.com/" SCRAPPING SCRIPT
  async getAllHupacArticles() {
    const articles = await getAllHupacArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getHupacArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "doppelmayr.com/" SCRAPPING SCRIPT
  async getAllDoppelArticles() {
    const articles = await getAllDoppelArticles();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getDoppelArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "aargauverkehr.ch/" SCRAPPING SCRIPT
  async getAllAarglArticles() {
    const articles = await getAllAarglArticles();

    for (let index = 0; index < 5; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getAarglArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "vvl.ch/" SCRAPPING SCRIPT
  //! NOTE : COMPLETED
  async getAllVvlArticles() {
    const articles = await getAllVvlArticles();

    // for (let index = 0; index < articles.length; index++) {
    //   const article = articles[index];
    //   await this.articlesService.createArticle(article);
    // }

    return articles;
  }

  //**/ NOTE: "rbs.ch/" SCRAPPING SCRIPT
  async getAllRbslArticles() {
    const articles = await getAllRbslArticles();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRbslArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "cst.ch/news/" SCRAPPING SCRIPT
  async getAllCstlArticles() {
    const articles = await getAllCstlArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getCstlArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "cargorail.ch/" SCRAPPING SCRIPT
  async getAllCarGorailArticles() {
    const articles = await getAllCarGorailArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getCarGorailArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "zentralbahn.ch/" SCRAPPING SCRIPT
  async getAllZentralBahnArticles() {
    const articles = await getAllZentralBahnArticles();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getZentralBahnArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "voev.ch/" SCRAPPING SCRIPT
  // TODO : [ON-HOLD]
  async getAllVoevArticles() {
    const articles = await getAllVoevArticles();
    return articles;
  }

  //**/ NOTE: "stadt-zuerich.ch/" SCRAPPING SCRIPT
  async getAllStadtArticles() {
    const articles = await getAllStadtArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getStadtArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "zvv.ch/" SCRAPPING SCRIPT
  async getAllZvvArticles() {
    const articles = await getAllZvvArticles();

    for (let index = 0; index < 5; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getZvvArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "alstom.com/" SCRAPPING SCRIPT
  async getAllAlstomArticles() {
    const articles = await getAllAlstomArticles();
    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getAlstomArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "new.abb.com/" SCRAPPING SCRIPT
  async getAllAbbArticles() {
    const articles = await getAllAbbArticles();
    for (let index = 0; index < 5; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getAbbArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "rhomberg-sersa.com/" SCRAPPING SCRIPT
  async getAllRhombergArticles() {
    const articles = await getAllRhombergArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRhombergArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
  async getAllBlsArticles() {
    const articles = await getAllBlsArticles();

    for (let index = 0; index < 7; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBlsArticle(article.url);

      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
  async getAllBlsAdArticles() {
    const articles = await getAllBlsAdArticles();
    for (let index = 0; index < 4; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getBlsArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "sbbcargo.com/" SCRAPPING SCRIPT
  //! NOTE : COMPLETED
  async getAllSbbCargoArticles() {
    const articles = await getAllSbbCargoArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
  async getAllMuellerFrauenNewsArticles() {
    const articles = await getAllMuellerFrauenNewsArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getMuellerFrauenNewsArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
  async getAllMuellerFrauenVideosArticles() {
    const articles = await getAllMuellerFrauenVideosArticles();

    // for (let index = 0; index < articles.length; index++) {
    //   const article = articles[index];
    //   await this.articlesService.createArticle(article);
    // }
    return articles;
  }

  //**/ NOTE: "c-vanoli.ch/" SCRAPPING SCRIPT
  async getAllCVanoliArticles() {
    const articles = await getAllCVanoliArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getCVanoliArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
  async getAllPressePortalEmArticles() {
    const articles = await getAllPressePortalEmArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getPressePortalAdArticle(article.url);
      await this.articlesService.createArticle(article);
    }
    return articles;
  }

  //**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
  async getAllRhbProjectArticles() {
    const articles = await getAllRhbProjectArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRhbProjectArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
  async getAllRhbNewsArticles() {
    const articles = await getAllRhbNewsArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getRhbProjectArticle(article.url);
      await this.articlesService.createArticle(article);
    }
    return articles;
  }

  //**/ NOTE: "sob.ch/" SCRAPPING SCRIPT
  async getAllSobArticles() {
    const articles = await getAllSobArticles();

    for (let index = 0; index < 10; index++) {
      const article = articles[index];
      article['originalContent'] = await this.scraperDeeperService.getSobArticle(article.url);
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: SCRAPE ALL RAIL SOURCES (for cron / manual trigger)
  async scrapeAllRailSources() {
    const results: { source: string; count: number; error?: string }[] = [];

    const sources = [
      { name: 'Roalps', fn: () => this.getAllRoalpsArticles() },
      { name: 'SEV Online', fn: () => this.getAllSevOnlineArticles() },
      { name: 'Bernmobil', fn: () => this.getAllBernmobilArticles() },
      { name: 'Bahnberufe', fn: () => this.getAllBahnberufeArticles() },
      { name: 'Lok Report', fn: () => this.getAllLokReportArticles() },
      { name: 'RailMarket', fn: () => this.getAllRailMarketArticles() },
      { name: 'Baublatt', fn: () => this.getAllBaublattArticles() },
      { name: 'ProBahn', fn: () => this.getAllProBahnArticles() },
      { name: 'Presseportal', fn: () => this.getAllPressEportalArticles() },
      { name: 'Bahnblogstelle', fn: () => this.getAllBahnBlogArticles() },
      { name: 'Hupac', fn: () => this.getAllHupacArticles() },
      { name: 'Doppelmayr', fn: () => this.getAllDoppelArticles() },
      { name: 'Aargau Verkehr', fn: () => this.getAllAarglArticles() },
      { name: 'RBS', fn: () => this.getAllRbslArticles() },
      { name: 'CST', fn: () => this.getAllCstlArticles() },
      { name: 'CarGoRail', fn: () => this.getAllCarGorailArticles() },
      { name: 'Zentralbahn', fn: () => this.getAllZentralBahnArticles() },
      { name: 'Stadt Zürich', fn: () => this.getAllStadtArticles() },
      { name: 'ZVV', fn: () => this.getAllZvvArticles() },
      { name: 'Alstom', fn: () => this.getAllAlstomArticles() },
      { name: 'ABB', fn: () => this.getAllAbbArticles() },
      { name: 'Rhomberg Sersa', fn: () => this.getAllRhombergArticles() },
      { name: 'BLS', fn: () => this.getAllBlsArticles() },
      { name: 'BLS Ad', fn: () => this.getAllBlsAdArticles() },
      { name: 'SBB Cargo', fn: () => this.getAllSbbCargoArticles() },
      { name: 'Müller Frauenfeld News', fn: () => this.getAllMuellerFrauenNewsArticles() },
      { name: 'C-Vanoli', fn: () => this.getAllCVanoliArticles() },
      { name: 'Presseportal EM', fn: () => this.getAllPressePortalEmArticles() },
      { name: 'RhB Projects', fn: () => this.getAllRhbProjectArticles() },
      { name: 'RhB News', fn: () => this.getAllRhbNewsArticles() },
      { name: 'SOB', fn: () => this.getAllSobArticles() },
      { name: 'Citrap', fn: () => this.getAllCitrapArticles() },
      // YouTube rail channels
      { name: 'YouTube: SBB CFF FFS', fn: () => this.getAllVideos('SBBCFFFFS') },
      { name: 'YouTube: BLS', fn: () => this.getAllVideos('blsag') },
      { name: 'YouTube: Rhätische Bahn', fn: () => this.getAllVideos('raborig') },
      { name: 'YouTube: Zentralbahn', fn: () => this.getAllVideos('zaborig') },
      { name: 'YouTube: SOB', fn: () => this.getAllVideos('SuedostbahnSOB') },
      { name: 'YouTube: Stadler Rail', fn: () => this.getAllVideos('StadlerRail') },
      { name: 'YouTube: Siemens Mobility', fn: () => this.getAllVideos('SiemensMobility') },
      { name: 'YouTube: Alstom', fn: () => this.getAllVideos('AlstomOfficial') },
      // NOTE: LinkedIn scraping is excluded from the automated batch.
      // It must be run manually from a trusted local machine via:
      //   GET /api/scraper/linkedin/sbb-cff-ffs
      //   GET /api/scraper/linkedin/bls-ag
    ];

    for (const source of sources) {
      try {
        console.log(`[SCRAPER] Scraping: ${source.name}...`);
        const articles = await source.fn();
        results.push({ source: source.name, count: articles?.length || 0 });
        console.log(`[SCRAPER] ✓ ${source.name}: ${articles?.length || 0} articles`);
      } catch (error) {
        console.error(`[SCRAPER] ✗ ${source.name}: ${error.message}`);
        results.push({ source: source.name, count: 0, error: error.message });
      }
    }

    // Format dates after scraping
    try {
      await this.articlesService.formateDates();
      console.log('[SCRAPER] ✓ Dates formatted');
    } catch (error) {
      console.error('[SCRAPER] ✗ Date formatting failed:', error.message);
    }

    // Download and enhance original images
    try {
      console.log('[SCRAPER] Downloading and enhancing images...');
      await this.articlesService.downloadImages();
      console.log('[SCRAPER] ✓ Images downloaded and enhanced');
    } catch (error) {
      console.error('[SCRAPER] ✗ Image download failed:', error.message);
    }

    return { message: 'Scrape completed', results };
  }
}
