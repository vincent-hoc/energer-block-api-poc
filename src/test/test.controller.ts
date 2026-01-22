import { Controller, Get, Header } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('summarize')
  @Header('Content-Type', 'text/html')
  getSummarizePage(): string {
    return this.testService.getSummarizePage();
  }

  @Get('analyse')
  @Header('Content-Type', 'text/html')
  getAnalysePage(): string {
    return this.testService.getAnalysePage();
  }
}
