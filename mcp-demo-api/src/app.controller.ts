import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Header('Content-Type', 'image/jpeg')
  @Get('/cat')
  async getCat() {
    const img = await this.appService.getCat();
    return img;
  }
}
