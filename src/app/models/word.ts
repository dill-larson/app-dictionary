import { WordFunction } from './word-function.enum';

export interface Word {
    word: string;
    function: string; //WordFunction will cause enum to be saved as numbers
}
