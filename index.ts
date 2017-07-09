import { MixerParser, TwitchParser, SmashcastParser, YoutubeParser } from './parsers';
import * as I from './interfaces';

export enum Platforms { Mixer, Twitch, Smashcast, Youtube }

export default class Parser {
	private smashcastEmotes: object[] = [];

	loadSmashcastEmotes(load: any) {
		this.smashcastEmotes = load;
	}

	parseMessage(type: Platforms, message: any): I.Message {
		if (type === Platforms.Mixer) {
			return MixerParser.parse(message);
		} else if (type === Platforms.Youtube) {
			return YoutubeParser.parse(message);
		} else if (type === Platforms.Twitch) {
			return TwitchParser.parse(<I.TwitchRawMessage>{ raw: message });
		} else if (type === Platforms.Smashcast) {
			return SmashcastParser.parse(message, this.smashcastEmotes);
		} else {
			throw new InvalidPlatformError();
		}
	}
}

export class InvalidPlatformError extends Error {
	constructor() {
		super('invalid platform');
	}
}

export { EmoticonIdentifier, Message, MessagePart, User } from './interfaces';
