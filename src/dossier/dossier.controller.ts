import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DossierService } from './dossier.service';

@Controller('api/dossier')
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}

  @Post('fost')
  async identifyFost(@Body() body: { documents: any[] }) {
    try {
      return await this.dossierService.identifyFost(body.documents);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur identification FOST';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('ocode')
  async analyzeOcode(@Body() body: { fields: any; fost: any }) {
    try {
      return await this.dossierService.analyzeFileOcode(body.fields, body.fost);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur analyse OCODE';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('analyse')
  async analyzeDossier(@Body() body: { documents: any[]; fosts: any }) {
    try {
      return await this.dossierService.analyzeDossier(body.documents, body.fosts);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur analyse';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('interpretation')
  async interpretDossier(@Body() body: { analyse: any }) {
    try {
      return await this.dossierService.interpretDossier(body.analyse);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur interprétation';
      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
