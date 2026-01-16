import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './analyze.dto';
export declare class AnalyzeController {
    private readonly analyzeService;
    constructor(analyzeService: AnalyzeService);
    analyze(analyzeDto: AnalyzeDto): Promise<any>;
}
