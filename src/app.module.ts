import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitorController } from './monitor/monitor.controllers';
import { AnagramsController } from './anagrams/anagrams.controllers';
import { AnagramsService } from './anagrams/anagrams.service';
import { MonitorService } from './monitor/monitor.service';
import { ShutdownService } from './app.shutdown.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],

  controllers: [AnagramsController, MonitorController],
  providers:   [AnagramsService,    MonitorService, ShutdownService],
})
export class AppModule {}
