import { DynamicModule, Module } from '@nestjs/common';
import { HttpCatModule } from './http-cat/http-cat.module';

@Module({})
export class InfrastructureModule {
  static forFeature(mapper: any): DynamicModule {
    return {
      module: InfrastructureModule,
      imports: [HttpCatModule.forFeature(mapper)],
      exports: [HttpCatModule],
    };
  }
}
