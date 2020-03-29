import { OnModuleDestroy } from "@nestjs/common";
import { Subject } from "rxjs";

export class ShutdownService implements OnModuleDestroy {
    private shutdownListener$: Subject<void> = new Subject();
  
    onModuleDestroy() {
        console.log('The server was been shutdown gracefully.')
    }
  
    subscribeToShutdown(shutdownFn: () => void): void {
      this.shutdownListener$.subscribe(() => shutdownFn());
    }
  
    shutdown() {
      this.shutdownListener$.next();
    }
  }