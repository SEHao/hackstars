import { Injectable } from '@nestjs/common';
import { CatDomainService } from './domain/service/cat/cat.service';

@Injectable()
export class AppService {
  constructor(private readonly catDomainService: CatDomainService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getCat() {
    return this.catDomainService.getCat({ httpCode: 200 });
  }
}
