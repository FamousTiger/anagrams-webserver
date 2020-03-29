export class MonitorDTO {
    totalWords: number  = 0;
    totalRequests: number = 0; 
    avgProcessingTimeNs: number  = 0;

    constructor(totalRequests: number,  avgProcessingTimeNs: number, totalWords: number) {
        this.totalRequests = totalRequests;
        this.avgProcessingTimeNs = avgProcessingTimeNs;
        this.totalWords = totalWords;
    }
}
