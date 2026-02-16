import { Test, TestingModule } from '@nestjs/testing';
import { ContentGeneratorController } from '../content-generator.controller';

describe('ContentGeneratorController', () => {
  let controller: ContentGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentGeneratorController],
    }).compile();

    controller = module.get<ContentGeneratorController>(ContentGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
