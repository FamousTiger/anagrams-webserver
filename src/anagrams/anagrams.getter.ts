export class AnagramsGetter {
    constructor(protected readonly data :  Record<string, Array<String>>) {}

    protected getWordKey(word: string) {
        return word.split('').sort().join('');
    }

    getAnagrams(word: string): String[] {
        var wordAnagrams = this.data[this.getWordKey(word)];
        if (wordAnagrams === undefined) {
            wordAnagrams = [];
        } else {
            const index = wordAnagrams.indexOf(word, 0);
            if (index > -1) {
                wordAnagrams.splice(index, 1);
        }
        return wordAnagrams;
      }
    }
    
  }