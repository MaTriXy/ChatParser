import * as I from '../interfaces';
import { Parser } from './Parser';

export class HitboxParser extends Parser<I.HitboxRawMessage> {
	type = 'hitbox';

	private emoteMapping: String[] = [];
	constructor(message: I.HitboxRawMessage, emotes: any) {
		super(message);

		emotes.forEach(emote => {
			this.emoteMapping[emote.icon_short] = emote.icon_path;
			this.emoteMapping[emote.icon_short_alt] = emote.icon_path;
		});
	}

	public getRoles(): String[] {
		const res = [];

		if (this.message.isOwner) {
			res.push('Streamer');
		}
		
		if (this.message.isSubscriber) {
			res.push('Subscriber');
		}
		
		if (this.message.role === 'user') {
			res.push('Mod');
		}
		
		if (this.message.isStaff) {
			res.push('Staff');
		}
		
		return res;
	}
	
	public getUser(): I.User {
		return {
			userId: null,
			username: this.message.name,
			roles: this.getRoles()
		};
	}
	
	public getMessage(): I.Message {
		return this.buildParts();
	}

	public buildParts(): I.MessagePart[] {
		const parts = [];

		/**
		 * Dear Hitbox,
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
						url: `https://edge.sf.hitbox.tv${this.emoteMapping[string]}`,
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

	public static parse(message: I.HitboxRawMessage, emotes: any) {
		return new HitboxParser(message, emotes).get();
	}
}