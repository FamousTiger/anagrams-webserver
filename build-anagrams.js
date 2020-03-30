class AnagramsGroups {
    constructor() {
        this.anagrams = {};
    }

    getWordKey(word) {
       return word.split('').sort().join('');
    }

    addWord(word) {
        var key = this.getWordKey(word);
        if (!(key in this.anagrams)) 
            this.anagrams[key] = new Set();
        this.anagrams[key].add(word);
    }

    getAnagrams() {
        return this.anagrams;
    }

    getVerboseAnagrams(keyPrefix) {
        const dict = this.anagrams;
        var verboseAnagrams = {};
        Object.keys(dict).forEach(function(key) {
            var keyAnagrams = Array.from(dict[key])
            keyAnagrams.forEach(function (word, index) {
                verboseAnagrams[word] = [].concat(keyAnagrams.slice(0, index) , keyAnagrams.slice(index+1));
                });
            }
            verboseAnagrams[keyPrefix + key] = keyAnagrams; 
        });
        return verboseAnagrams;
    }

    serialize(filename, firstLine, dict) {
        var fsLib       = require('fs');
        var filewriter  = fsLib.createWriteStream(filename, {flags: 'w'});
        filewriter.write(firstLine);
        Object.keys(dict).forEach(function(key) {
            filewriter.write("\n" + key + " ");
            dict[key].forEach(function (word) {
                filewriter.write(word + " ");
            });
        });
        filewriter.end();
        console.log('Data is written successfully to', filename);    
    }
}

class AnagramsBuilder {
    constructor() {
        require('dotenv').config()
        this.pathLib    = require('path');
        this.fsLib      = require('fs');
        this.inputFile  = this.pathLib.join(process.cwd(), process.env.RAW_DICT_FNAME);
        this.outputFile = this.pathLib.join(process.cwd(), process.env.PROCCESSED_DICT_FNAME);
        this.isVerbose  = (process.env.ALGORITHM=='performance_over_memory');
        this.KEY_PREFIX = process.env.KEY_PREFIX;

        this.anagramsGroups = new AnagramsGroups();
        this.numOfWords     = 0;
    }

    isWordConsistOnlySameLetter(word) {
        return (/^([ -~])\1*$/).test(word);
    }

    processWord(word) {
        if (word.length > 0) {
            this.numOfWords++;
            if (!this.isWordConsistOnlySameLetter(word)) {
                this.anagramsGroups.addWord(word);
            } else {
                console.warn('\tSkipping', word, '- It is not anagrams material');
            }
        }
    }

    getStreamReader(filename){
        var readlineLib = require('readline');
        var streamLib   = require('stream');
        var inStream    = this.fsLib.createReadStream(filename);
        var outStream   = new streamLib();
        return readlineLib.createInterface(inStream, outStream);   
    }

    canReadInputFile() {
        try {
            this.fsLib.existsSync(this.inputFile);
        } catch (err) {
            console.error('Error: no such file or directory', this.inputFile);
            return false;
        }

        try {
            this.fsLib.accessSync(this.inputFile, this.fsLib.constants.R_OK);
        } catch (err) {
            console.error('Error: Cannot read from', this.inputFile);
            return false;
        }
        return true;
    }

    canWriteOutputFile() {
        try {
            this.fsLib.accessSync(this.outputFile, this.fsLib.constants.W_OK);
        } catch (err) {
            console.error('Error: Cannot write to', this.outputFile);
            return false;
        }
        return true;
    }

    processDictionary() {
        if (!this.canReadInputFile() || !this.canWriteOutputFile()) {
            console.error('Error: Processing failed!');
           return;
        }

        console.log('Processing', this.inputFile, '.Please wait.');
        var reader = this.getStreamReader(this.inputFile);
        const that = this;
        reader.on('line', function(word) {
            that.processWord(word.trim()); 
        });

        reader.on('close', function() { 
            that.anagramsGroups.serialize(that.outputFile, that.numOfWords.toString(),
            that.isVerbose ? that.anagramsGroups.getVerboseAnagrams(that.KEY_PREFIX) : that.anagramsGroups.getAnagrams());
        });


    }
}

builder = new AnagramsBuilder();
builder.processDictionary();



