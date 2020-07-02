import { WordFunction } from './word-function.enum';

export class Word {
    constructor() {
        this.word = '';
        this.function = WordFunction.Noun;
    }
    public word: string;
    public function: WordFunction;
}
