import { BatchService } from './batch.service';
import { BatchDto } from '../dto/batch.dto';
export declare class BatchController {
    private readonly batchService;
    constructor(batchService: BatchService);
    processBatch(batchDto: BatchDto): Promise<any>;
}
