/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { getRoalpsArticle } from './scraping-scripts/roalps.script';
import { getSevOnlineArticle } from './scraping-scripts/sev-online.script';
import { getOtifArticle } from './scraping-scripts/otif.script';
import { getCitrapArticle } from './scraping-scripts/citrap-vaud.script';
import { getBernmobilArticle } from './scraping-scripts/bernmobil.script';
import { getBahnberufeArticle } from './scraping-scripts/bahnberufe.script';
import { getLokReportArticle } from './scraping-scripts/lok-report.script';
import { getRailMarketArticle } from './scraping-scripts/railmarket.script';
import { getBaublattArticle } from './scraping-scripts/baublatt.script';
import { getProBahnArticle } from './scraping-scripts/pro-bahn.script';
import { getPressePortalAdArticle, getPressEportalArticle } from './scraping-scripts/presseportal.script';
import { getBahnBlogArticle } from './scraping-scripts/bahnblogstelle.script';
import { getHupacArticle } from './scraping-scripts/hupac.script';
import { getDoppelArticle } from './scraping-scripts/doppelmayr.script';
import { getAarglArticle } from './scraping-scripts/aargauverkehr.script';
import { getRbslArticle } from './scraping-scripts/rbs.script';
import { getCstlArticle } from './scraping-scripts/cst.script';
import { getCarGorailArticle } from './scraping-scripts/cargorail.script';
import { getZentralBahnArticle } from './scraping-scripts/zentralbahn.script';
import { getStadtArticle } from './scraping-scripts/stadt-zuerich.script';
import { getZvvArticle } from './scraping-scripts/zvv.script';
import { getAlstomArticle } from './scraping-scripts/alstom.script';
import { getAbbArticle } from './scraping-scripts/abb.script';
import { getRhombergArticle } from './scraping-scripts/rhomberg-sersa.script';
import { getBlsArticle } from './scraping-scripts/bls.script';
import { getMuellerFrauenNewsArticle } from './scraping-scripts/mueller-frauenfeld.script';
import { getCVanoliArticle } from './scraping-scripts/c-vanoli.script';
import { getRhbProjectArticle } from './scraping-scripts/rhb.script';
import { getSobArticle } from './scraping-scripts/sob.script';

@Injectable()
export class ScraperDeeperService {
  private async getPuppeteerInstance(cookie = []) {
    const browser = await puppeteer.launch({ headless: false });
    if (cookie.length) {
      browser.setCookie(...cookie);
    }
    const page = await browser.newPage();
    return { browser, page };
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getRoalpsArticle(pageUrl: string) {
    return getRoalpsArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getSevOnlineArticle(pageUrl: string) {
    return getSevOnlineArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  // TODO: NOT FINISH
  async getOtifArticle(pageUrl: string) {
    return getOtifArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getCitrapArticle(pageUrl: string) {
    return getCitrapArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getBernmobilArticle(pageUrl: string) {
    return getBernmobilArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getBahnberufeArticle(pageUrl: string) {
    return getBahnberufeArticle(pageUrl);
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getLokReportArticle(pageUrl: string) {
    return getLokReportArticle(pageUrl);
  }

  async getRailMarketArticle(pageUrl: string) {
    return getRailMarketArticle(pageUrl);
  }

  async getBaublattArticle(pageUrl: string) {
    return getBaublattArticle(pageUrl);
  }

  async getProBahnArticle(pageUrl: string) {
    return getProBahnArticle(pageUrl);
  }

  async getPressEportalArticle(pageUrl: string) {
    return getPressEportalArticle(pageUrl);
  }

  async getBahnBlogArticle(pageUrl: string) {
    return getBahnBlogArticle(pageUrl);
  }

  async getHupacArticle(pageUrl: string) {
    return getHupacArticle(pageUrl);
  }

  async getDoppelArticle(pageUrl: string) {
    return getDoppelArticle(pageUrl);
  }

  async getAarglArticle(pageUrl: string) {
    return getAarglArticle(pageUrl);
  }

  async getRbslArticle(pageUrl: string) {
    return getRbslArticle(pageUrl);
  }

  async getCstlArticle(pageUrl: string) {
    return getCstlArticle(pageUrl);
  }

  async getCarGorailArticle(pageUrl: string) {
    return getCarGorailArticle(pageUrl);
  }

  async getZentralBahnArticle(pageUrl: string) {
    return getZentralBahnArticle(pageUrl);
  }

  async getStadtArticle(pageUrl: string) {
    return getStadtArticle(pageUrl);
  }

  async getZvvArticle(pageUrl: string) {
    return getZvvArticle(pageUrl);
  }

  async getAlstomArticle(pageUrl: string) {
    return getAlstomArticle(pageUrl);
  }

  async getAbbArticle(pageUrl: string) {
    return getAbbArticle(pageUrl);
  }

  async getRhombergArticle(pageUrl: string) {
    return getRhombergArticle(pageUrl);
  }

  async getBlsArticle(pageUrl: string) {
    return getBlsArticle(pageUrl);
  }

  async getMuellerFrauenNewsArticle(pageUrl: string) {
    return getMuellerFrauenNewsArticle(pageUrl);
  }

  async getCVanoliArticle(pageUrl: string) {
    return getCVanoliArticle(pageUrl);
  }

  async getPressePortalAdArticle(pageUrl: string) {
    return getPressePortalAdArticle(pageUrl);
  }

  async getRhbProjectArticle(pageUrl: string) {
    return getRhbProjectArticle(pageUrl);
  }

  async getSobArticle(pageUrl: string) {
    return getSobArticle(pageUrl);
  }
}
