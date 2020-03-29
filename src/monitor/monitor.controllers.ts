import { Controller, Get, Header, OnApplicationBootstrap} from '@nestjs/common';
import { MonitorDTO } from './monitor.dto';
import { MonitorService } from './monitor.service';
import { AnagramsService } from 'src/anagrams/anagrams.service';

@Controller('stats')
export class MonitorController implements OnApplicationBootstrap {
  private numOfWords: number;
  constructor(private readonly monitorService: MonitorService,
              private readonly anagramsService: AnagramsService) {}

  onApplicationBootstrap() {
    this.numOfWords = this.anagramsService.getNumOfWords;
  }
  
  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', "0")
  @Header('Content-Type', 'application/json')
  getStats() : MonitorDTO {
    return new MonitorDTO(this.monitorService.numberOfRequests, this.monitorService.avgProccesingTime, this.numOfWords ) ;
  }
}
 