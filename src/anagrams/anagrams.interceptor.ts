import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MonitorService } from 'src/monitor/monitor.service';

@Injectable()
export class AnagramsInterceptor implements NestInterceptor {
    constructor(private readonly monitorService: MonitorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const  startNano = process.hrtime.bigint();
    return next
      .handle()
      .pipe(
        tap(() => this.monitorService.incApiCount(startNano, process.hrtime.bigint())),
      );
  }
}