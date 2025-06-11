import { Test, TestingModule } from '@nestjs/testing';
import { CatDomainService } from './cat.service';

describe('CatDomainService', () => {
  let service: CatDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatDomainService],
    }).compile();

    service = module.get<CatDomainService>(CatDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
