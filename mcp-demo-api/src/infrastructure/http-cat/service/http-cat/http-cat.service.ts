import { Inject, Injectable, Logger } from '@nestjs/common';
import httpCatConfig from '../../config/http-cat.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class HttpCatService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(httpCatConfig.KEY)
    private readonly config: ConfigType<typeof httpCatConfig>,
    private readonly httpService: HttpService,
  ) {}

  getHttpCat(httpCode: number) {
    this.logger.verbose(
      `httpCode: ${JSON.stringify(httpCode)}`,
      this.getHttpCat.name,
    );

    return lastValueFrom(
      this.httpService
        .get<any>(`${this.config.httpCatApi}/${httpCode}`, {})
        .pipe(
          map((res) => res.data),
          catchError((err: AxiosError) => {
            this.logger.debug(err.response?.data, this.getHttpCat.name);
            this.logger.error(err.message, this.getHttpCat.name);
            throw err;
          }),
        ),
    );
  }
}
