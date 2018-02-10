import { Parser } from './Parser';
import { IChatRole, TwitchRawMessage, IMessageContext, IMessagePart, IChatMessage, ChatPlatform } from '../interfaces';

export class TwitchParser extends Parser<TwitchRawMessage> {
	type = ChatPlatform.Smashcast;
	private meta: any = [];
	private emoteMapping: any = [];

	constructor(message: TwitchRawMessage) {
		super(message);

		this.meta = this.parseMeta();
		if (this.getMeta('emotes')) this.mapEmotes(this.getMeta('emotes').split("/"));

	}

	private parseMeta(): any {
		const arr = [];
		const parts = this.message.raw.substring(1).split(" :")[0].split(";");
		
		parts.forEach((data) => {
			var ex = data.split('=');
			arr[ex[0]] = ex[1];
		});
		
		return arr;
	}

	private checkBadges(role: string): boolean {
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

	public getRoles(): IChatRole[] {
		const res = [IChatRole.User];
		
		if (this.checkBadges('broadcaster')) {
			res.push(IChatRole.Owner);
		}

		if (this.getMeta('subscriber') === '1') {
			res.push(IChatRole.Subscriber);
		}

		if (this.getMeta('mod') === '1') {
			res.push(IChatRole.Moderator);
		}

		if (['global_mod', 'admin', 'staff'].indexOf(this.getMeta('user-type')) !== -1) {
			res.push(IChatRole.Staff);
		}

		return res;
	}

	public getMeta(key: string): string {
		return this.meta[key];
	}
	
	public getChatMessage(): string {
		return this.message.raw.split(" ").slice(4).join(" ").substring(1).replace(/\r?\n|\r/g, '');
	}

	public getUser(): IMessageContext {
		return {
			username: this.getMeta('display-name'),
			userId: this.getMeta('user-id'),
			roles: this.getRoles(),
		};
	}
	
	public getMessage(): IMessagePart[] {
		return this.buildParts();
	}

	public buildParts(): IMessagePart[] {
		const parts = [];
		
		this.getChatMessage().split(' ').forEach(string => {
			if (typeof this.emoteMapping[string] === 'number') {
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

	public static parse(message: TwitchRawMessage): IChatMessage{
		return new TwitchParser(message).get();
	}
}