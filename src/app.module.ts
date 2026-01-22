import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from './batch/batch.module';
import { SummarizeModule } from './summarize/summarize.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './upload/upload.module';
import { OcrModule } from './ocr/ocr.module';
import { ExtractModule } from './extract/extract.module';
import { DossierModule } from './dossier/dossier.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BatchModule,
    SummarizeModule,
    AnalyzeModule,
    AuthModule,
    DashboardModule,
    UploadModule,
    OcrModule,
    ExtractModule,
    DossierModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
