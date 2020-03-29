import { Controller, Get, Query, Header, UseInterceptors, UsePipes} from '@nestjs/common';
import { AnagramsService } from './anagrams.service';
import { AnagramsDTO } from './anagrams.dto';
import { AnagramsInterceptor } from './anagrams.interceptor';
import { MandatoryStringPipe } from './mandatoryStringPipe';

@Controller('similar')
export class AnagramsController {
  constructor(private readonly service: AnagramsService) {}

  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', "0")
  @Header('Content-Type', 'application/json')
  @UseInterceptors(AnagramsInterceptor)
  @UsePipes(MandatoryStringPipe)
  getAnagrams(@Query('word') word: string) : AnagramsDTO {   
    return this.service.getAnagrams(word);
  }
}
 