import { Test, TestingModule } from '@nestjs/testing';
import { ScraperDeeperService } from './scraper-deeper.service';

describe('ScraperDeeperService', () => {
  let service: ScraperDeeperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperDeeperService],
    }).compile();

    service = module.get<ScraperDeeperService>(ScraperDeeperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
