import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectionToken } from './enum/injection-token.enum';
import { HttpCatService } from './service/http-cat/http-cat.service';
import { CatService } from './service/cat/cat.service';
import httpCatConfig from './config/http-cat.config';

@Module({})
export class HttpCatModule {
  static forFeature(httpCatMapper: any): DynamicModule {
    return {
      module: HttpCatModule,
      imports: [ConfigModule.forFeature(httpCatConfig), HttpModule],
      providers: [
        HttpCatService,
        CatService,
        {
          provide: InjectionToken.HTTP_CAT_MAPPER,
          useFactory: () => new httpCatMapper(),
        },
      ],
      exports: [CatService],
    };
  }
}
