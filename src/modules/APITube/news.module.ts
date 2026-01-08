import { Module } from '@nestjs/common';
import { NewsService } from './news.service';   
import { ConfigModule } from '@nestjs/config';
import { NewsController } from './news.controller';
@Module({
  imports: [ConfigModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
