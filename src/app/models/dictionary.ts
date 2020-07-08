import { User } from './user';
import { Views } from './views.enum';
import { Word } from './word';

export class Dictionary {
    name: string;
    owner: User;
	admins: User[];
    moderators: User[];
    view: Views;
    tags: string[];
    words: Word[];
}
