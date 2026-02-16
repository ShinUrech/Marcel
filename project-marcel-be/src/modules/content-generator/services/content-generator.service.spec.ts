import { Test, TestingModule } from '@nestjs/testing';
import { ContentGeneratorService } from './content-generator.service';

describe('ContentGeneratorService', () => {
  let service: ContentGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentGeneratorService],
    }).compile();

    service = module.get<ContentGeneratorService>(ContentGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
