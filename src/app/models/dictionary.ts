import { User } from './user';
import { Views } from './views.enum';
import { Word } from './word';

export interface Dictionary {
    id?: string,
    name: string;
    owner: User;
	//admins: User[];
    //moderators: User[];
    view: Views;
    tags: string[];
    words: Word[];
}
