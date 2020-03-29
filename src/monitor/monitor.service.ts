import { Injectable} from '@nestjs/common';

@Injectable()
export class  MonitorService{
  
incApiCount(startNano: bigint, endNano: bigint) {
    this._numberOfRequests++;
    this._sumProccesingTimeNano += (endNano - startNano);
}

get avgProccesingTime() : number {
    return Number((this._numberOfRequests > 0) ? this._sumProccesingTimeNano / this._numberOfRequests : 0n);
}

get numberOfRequests(): number {
    return Number(this._numberOfRequests);
}
  private _numberOfRequests: bigint = 0n;
  private _sumProccesingTimeNano: bigint = 0n;

}  
