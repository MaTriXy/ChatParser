import { IPlatform } from "./Platform";
import { Role } from "../roles";

export interface IMessageSegment {
	type: string,
	text: string,
	identifier?: string | { type: string, url: string, coords?: any };
}

export interface IContext {
	userId: string,
	username: string,
    primaryRole: Role,
    roles: Role[],
}

export interface IMessageMetadata {
	description: string;
	command: boolean;
	commandName?: string;
}

export interface IMessage {
	platform: IPlatform,
	user: IContext,
    message: IMessageSegment[],
    messageId: string | null;
	raw: any,
	metadata: IMessageMetadata;
}