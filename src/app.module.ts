import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from './batch/batch.module';
import { SummarizeModule } from './summarize/summarize.module';
import { AnalyzeModule } from './analyze/analyze.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BatchModule,
    SummarizeModule,
    AnalyzeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
