import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectionToken } from '../../enum/injection-token.enum';
import httpCatConfig from '../../config/http-cat.config';
import { ConfigType } from '@nestjs/config';
import { HttpCatService } from '../http-cat/http-cat.service';

@Injectable()
export class CatService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(InjectionToken.HTTP_CAT_MAPPER)
    private readonly mapper: any,
    @Inject(httpCatConfig.KEY)
    private readonly config: ConfigType<typeof httpCatConfig>,
    private readonly httpCatService: HttpCatService,
  ) {}

  async getCat(params: { httpCode: number }) {
    this.logger.verbose(`params: ${JSON.stringify(params)}`, this.getCat.name);

    // wip: map params
    const cat = await this.httpCatService.getHttpCat(params.httpCode);

    // return this.mapper.toListBo(nestorList, this.config) as T;
    return cat;
  }
}
