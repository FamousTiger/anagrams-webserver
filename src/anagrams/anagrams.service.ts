import { Injectable, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnagramsDTO } from './anagrams.dto';
import { ShutdownService } from 'src/app.shutdown.service';
import { AnagramsGetter } from './anagrams.getter';
import { AnagramsVerboseGetter } from './anagrams.verboseGetter';

@Injectable()
export class AnagramsService implements OnModuleInit{
  constructor(private readonly configService: ConfigService, 
    private readonly shutdownService: ShutdownService) {
      this.anagramsGetter = this.anagramsGetterFactory();
    }

  onModuleInit() {
    this.loadData(this.configService.get<string>('PROCCESSED_DICT_FNAME'));
  }
  
  private anagramsGetterFactory() : AnagramsGetter {
    return (this.configService.get<string>('ALGORITHM')=='performance_over_memory') ? 
      new AnagramsVerboseGetter(this.anagrams, this.configService.get<string>('KEY_PREFIX')) :
      new AnagramsGetter(this.anagrams);
  }

  private shouldFastFail(word: string) {
    return (word.length > this.longestWordLen);
  }

  getAnagrams(word: string): AnagramsDTO {
    if (this.shouldFastFail(word)) {
      return new AnagramsDTO([]);
    }
    return new AnagramsDTO( this.anagramsGetter.getAnagrams(word));
  }

  get getNumOfWords() : number {
    return this.numOfWords;
  }

  private canReadInputFile(filename) {
    const fsLib = require('fs');
    try {
        fsLib.accessSync(filename, fsLib.constants.R_OK);
    } catch (err) {
        console.error('Error: Failed to load data. Cannot read from', filename);
        return false;
    }
    return true;
}

  private loadData(filename: string) {
    console.log('Loading data. Please wait');
    if (!this.canReadInputFile(filename)) {
      this.shutdownService.shutdown();
      return;
    }

    const lineByLine = require('n-readlines');
    const reader = new lineByLine(filename);
    var line = reader.next();
    this.numOfWords = parseInt(line.toString());
    if (isNaN(this.numOfWords)) {
      console.error('Error: Failed to load data. File (', filename, ') seems corrupted.');
      this.shutdownService.shutdown();
      return;
    }

    while (line = reader.next()) {
      const words = line.toString().split(" ").filter(item => item);
      if (words.length > 1) {
        const key = words[0];
        this.anagrams[key] = words.slice(1);  
        if (key.length > this.longestWordLen) {
          this.longestWordLen = key.length
          }
        }
    }
    
    console.log('Data is loaded successfully.');
}
  private anagrams       :  Record<string, Array<String>> = {};
  private longestWordLen : number = 0;
  private numOfWords     : number = 0;
  private anagramsGetter : AnagramsGetter;

}  
