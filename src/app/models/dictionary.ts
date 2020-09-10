import { Views } from './views.enum';
import { Word } from './word';

export interface Dictionary {
    id?: string,
    name: string;
    owner: string; //user id
    editor?: string[];
    viewer?: string[];
	//admins: User[];
    //moderators: User[];
    size: number;
    view: Views;
    tags: string[];
    words?: Word[];
}
