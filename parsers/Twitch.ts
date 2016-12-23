import * as I from '../interfaces';
import { Parser } from './Parser';

export class TwitchParser extends Parser<I.TwitchRawMessage> {
	type = 'twitch';
	private meta: any = [];
	private emoteMapping: any = [];

	constructor(message: I.TwitchRawMessage) {
		super(message);

		this.meta = this.parseMeta();
		if (this.getMeta('emotes')) this.mapEmotes(this.getMeta('emotes').split("/"));

	}

	private parseMeta(): any {
		const arr = [];
		const parts = this.message.raw.substring(1).split(" :")[0].split(";");
		
		parts.forEach((data, i) => {
			var ex = data.split('=');
			arr[ex[0]] = ex[1];
		});
		
		return arr;
	}

	private checkBadges(role: String): Boolean {
		const badges = this.getMeta('badges').split(",");
		return !!String(badges).search(`/^${role}/1$/`);
	}

	private mapEmotes(emotes: any) {
		emotes.forEach(emote => {
			const mapping = emote.split(':');
			const range = mapping[1].split('-');
			const emoteText = this.getChatMessage().substring(parseInt(range[0], 10), parseInt(range[1], 10) + 1);
			this.emoteMapping[emoteText] = parseInt(mapping[0], 10);
		});
	}

	public getRoles(): String[] {
		const res = [];
		
		if (this.checkBadges('broadcaster')) {
			res.push('Streamer');
		}

		if (this.getMeta('turbo') === '0') {
			res.push("Turbo");
		}

		if (this.getMeta('subscriber') === '1') {
			res.push('Subscriber');
		}

		if (this.getMeta('mod') === '1') {
			res.push('Mod');
		}

		if (['global_mod', 'admin', 'staff'].indexOf(this.getMeta('user-type')) !== -1) {
			res.push('Staff');
		}

		return res;
	}

	public getMeta(key: string): string {
		return this.meta[key];
	}
	
	public getChatMessage(): String {
		return this.message.raw.split(" ").slice(4).join(" ").substring(1).replace(/\r?\n|\r/g, '');
	}

	public getUser(): I.User {
		return {
			username: this.getMeta('display-name'),
			userId: parseInt(this.getMeta('user-id'), 10),
			roles: this.getRoles()
		};
	}
	
	public getMessage(): I.Message {
		return this.buildParts();
	}

	public buildParts(): I.MessagePart[] {
		const parts = [];
		
		this.getChatMessage().split(' ').forEach(string => {
			if (this.emoteMapping[string]) {
				parts.push({
					type: 'emoticon',
					text: string,
					identifier: {
						type: 'direct',
						url: `http://static-cdn.jtvnw.net/emoticons/v1/${this.emoteMapping[string]}/1.0`,
					}
				});
			} else if (string.indexOf("@") == 0) {
				parts.push({
					type: 'mention',
					text: string,
					identifier: string.split('@')[1]
				});
			} else if (string.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)) {
				parts.push({
					type: 'url',
					text: string,
					identifier: string
				});
			} else {
				parts.push({
					type: 'text',
					text: string
				});
			}
		});
		return parts;
	}

	public static parse(message: I.TwitchRawMessage) {
		return new TwitchParser(message).get();
	}
}