import { User } from './user';
import { Views } from './views.enum';
import { Word } from './word';

export class Dictionary {
    constructor() {
        this.name = '';
        this.owner = null;
        this.admins = [];
        this.moderators = [];
        this.view = Views.Public;
        this.tags = [];
        this.words = [];
	}
    public name: string;
    public owner: User;
	public admins: User[];
    public moderators: User[];
    public view: Views;
    public tags: string[];
    public words: Word[];
}
