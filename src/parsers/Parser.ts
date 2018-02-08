import { IChatMessage, IChatRole, IMessagePart, IMessageContext, ChatPlatform } from '../interfaces';

export abstract class Parser<T> {
	protected message: T;
	abstract type: ChatPlatform;

	constructor(message: T) {
		this.message = message;
	}

	public abstract getRoles(): IChatRole[];
	public abstract getUser(): IMessageContext;
	public abstract getMessage(): IMessagePart[];

	get(): IChatMessage {
		return {
			platform: this.type,
			user: this.getUser(),
			message: this.getMessage(),
			raw: <any>null,
		};
	}
}