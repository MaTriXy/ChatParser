import { BeamParser, TwitchParser, HitboxParser, YoutubeParser } from './parsers';
import * as I from './interfaces';

export enum Platforms { Beam, Twitch, Hitbox, Youtube }

export default class Parser {
	private hitboxEmotes: Object = [];

	loadHitboxEmotes(load: any) {
		this.hitboxEmotes = load;    
	}

	parseMessage(type: Platforms, message: any): I.Message {
		if (type == Platforms.Beam) {
			return BeamParser.parse(message);
		} else if (type === Platforms.Youtube) {
			return YoutubeParser.parse(message);
		} else if (type == Platforms.Twitch) {
			return TwitchParser.parse(<I.TwitchRawMessage>{ raw: message });
		} else if (type == Platforms.Hitbox) {
			return HitboxParser.parse(message, this.hitboxEmotes);
		}
	}
}