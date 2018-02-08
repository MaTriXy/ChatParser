import { Parser } from './Parser';
import { IChatRole, SmashcastRawMessage, IMessageContext, IMessagePart, IChatMessage, ChatPlatform } from '../interfaces';

export class SmashcastParser extends Parser<SmashcastRawMessage> {
	type = ChatPlatform.Smashcast;

	private emoteMapping: string[] = [];

	constructor(message: SmashcastRawMessage, emotes: any) {
		super(message);

		emotes.forEach(emote => {
			this.emoteMapping[emote.icon_short] = emote.icon_path;
			this.emoteMapping[emote.icon_short_alt] = emote.icon_path;
		});
	}

	public getRoles(): IChatRole[] {
		const res = [IChatRole.User];

		if (this.message.isOwner) {
			res.push(IChatRole.Owner);
		}
		
		if (this.message.isSubscriber) {
			res.push(IChatRole.Subscriber);
		}
		
		if (this.message.role === 'user') {
			res.push(IChatRole.Moderator);
		}
		
		if (this.message.isStaff) {
			res.push(IChatRole.Staff);
		}
		
		return res;
	}
	
	public getUser(): IMessageContext {
		return {
			userId: null,
			username: this.message.name,
			roles: this.getRoles(),
		};
	}
	
	public getMessage(): IMessagePart[] {
		return this.buildParts();
	}

	public buildParts(): IMessagePart[] {
		const parts = [];

		/**
		 * Dear Smashcast,
		 * Why the hell are you sending HTML to handle links/inline images?!
		 *
		 * Regards,
		 * Luke @ StreamJar.
		 */
		let text = this.message.text.replace(/<a href=[\'"]?([^\'" >]+).+">(.*)<\/a>/g, "$1"); // We can handle URL parsing on our own.
		text = text.replace(/<div.+<\/div>/g, ''); // Strip out inline images

		text.split(" ").forEach((string: string) => {
			if (typeof this.emoteMapping[string] === 'string') {
				parts.push({
					type: 'emoticon',
					text: string,
					identifier: {
						type: 'direct',
						url: `https://edge.sf.smashcast.tv${this.emoteMapping[string]}`,
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

	public static parse(message: SmashcastRawMessage, emotes: any): IChatMessage {
		return new SmashcastParser(message, emotes).get();
	}
}