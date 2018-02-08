import { MixerParser, TwitchParser, SmashcastParser, YoutubeParser } from './parsers';
import { IChatMessage, TwitchRawMessage, ChatPlatform } from './interfaces';

export class Parser {
	private smashcastEmotes: Object = [];

	public loadSmashcastEmotes(load: any) {
		this.smashcastEmotes = load;    
	}

	public parseMessage(type: ChatPlatform, message: any): IChatMessage {
		if (type == ChatPlatform.Mixer) {
			return MixerParser.parse(message);
		} else if (type === ChatPlatform.Youtube) {
			return YoutubeParser.parse(message);
		} else if (type == ChatPlatform.Twitch) {
			return TwitchParser.parse(<TwitchRawMessage>{ raw: message });
		} else if (type == ChatPlatform.Smashcast) {
			return SmashcastParser.parse(message, this.smashcastEmotes);
		}
	}
}

export * from './interfaces';