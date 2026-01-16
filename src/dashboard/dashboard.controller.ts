import { Controller, Get, Header } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getDashboard(): string {
    return this.dashboardService.getDashboard();
  }
}
