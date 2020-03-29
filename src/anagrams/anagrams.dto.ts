export class AnagramsDTO {
    similar : String[];

    constructor(anagrams: String[] ) {
        this.similar = anagrams;
    }
}
