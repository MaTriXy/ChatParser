import * as I from '../interfaces';

export abstract class Parser<T> {
	protected message: T;
	abstract type;

	constructor(message: T) {
		this.message = message;
	}

	public abstract getRoles(): any;
	public abstract getUser(): I.User;
	public abstract getMessage(): I.Message;

	get() {
		return {
			platform: this.type,
			user: this.getUser(),
			message: this.getMessage(),
			raw: this
		};
	}
}