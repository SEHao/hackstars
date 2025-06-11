import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CatMapper } from './mapper/cat/cat.mapper';
import { CatDomainService } from './service/cat/cat.service';

@Module({
  imports: [InfrastructureModule.forFeature(CatMapper)],
  providers: [CatMapper, CatDomainService],
  exports: [CatDomainService],
})
export class DomainModule {}
