import { Dictionary } from '../models/dictionary';

export interface User {
	id?: string;
	name: string;
	email: string;
	password: string;
	library: Dictionary[];
}