import { Test, TestingModule } from '@nestjs/testing';
import { HttpCatService } from './http-cat.service';

describe('HttpCatService', () => {
  let httpCatService: HttpCatService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HttpCatService],
    }).compile();

    httpCatService = app.get<HttpCatService>(HttpCatService);
  });

  it('should be defined', () => {
    expect(httpCatService).toBeDefined();
  })
});
