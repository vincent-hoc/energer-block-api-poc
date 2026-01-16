import { SummarizeService } from './summarize.service';
import { SummarizeDto } from './summarize.dto';
export declare class SummarizeController {
    private readonly summarizeService;
    constructor(summarizeService: SummarizeService);
    summarize(summarizeDto: SummarizeDto): Promise<any>;
}
