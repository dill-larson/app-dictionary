//import { Dictionary } from './dictionary.model';

export class User {
	constructor(){
		this.name = '';
		this.email = '';
		this.password = '';
		//this.library = [];
	}
	public name: String;
	public email: String;
	public password: String;
	//private library: Dictionary[];

	// public addDictionary(dict: Dictionary): void {
	// 	this.library.push(dict);
	// }

	// public getLibrary(): Dictionary[] {
	// 	return this.library;
	// }
}