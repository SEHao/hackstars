import { Injectable } from '@nestjs/common';
import { CatService } from 'src/infrastructure/http-cat/service/cat/cat.service';

@Injectable()
export class CatDomainService {
  constructor(private readonly catService: CatService) {}

  getCat(params: { httpCode: number }) {
    return this.catService.getCat(params);
  }
}
