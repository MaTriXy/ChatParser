import * as I from '../interfaces';

export abstract class Parser<T> {
	public abstract type: string;
	protected message: T;

	constructor(message: T) {
		this.message = message;
	}

	public abstract getRoles(): I.Role[];
	public abstract getUser(): I.User;
	public abstract getMessage(): I.MessagePart[];

	public get(): I.Message {
		return {
			platform: this.type,
			user: this.getUser(),
			message: this.getMessage(),
			raw: this,
		};
	}
}
