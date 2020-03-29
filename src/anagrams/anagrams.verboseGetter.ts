import { AnagramsGetter } from "./anagrams.getter";

export class AnagramsVerboseGetter extends AnagramsGetter {
    constructor(protected readonly data :  Record<string, Array<String>>, 
        protected readonly keyPrefix: string) {
        super(data);
    }

    protected getWordKey(word: string) {
        return this.keyPrefix + super.getWordKey(word);
    }

    getAnagrams(word: string): String[] {
        var wordAnagrams = this.data[word];
        if (wordAnagrams === undefined) {
            wordAnagrams = this.data[this.getWordKey(word)];
        }
        return ( wordAnagrams === undefined) ? [] : wordAnagrams;
    }
}
