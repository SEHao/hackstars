import { Test, TestingModule } from '@nestjs/testing';
import { CatMapper } from './cat.mapper';

describe('CatMapper', () => {
  let provider: CatMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatMapper],
    }).compile();

    provider = module.get<CatMapper>(CatMapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
