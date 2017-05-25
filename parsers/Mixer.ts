import * as I from '../interfaces';
import { Parser } from './Parser';

export class MixerParser extends Parser<I.MixerRawMessage> {
	type = 'mixer';
	
	public getRoles(): String[] {
		return this.message.user_roles;
	}
	
	public getUser(): I.User {
		return {
			userId: this.message.user_id,
			username: this.message.user_name,
			roles: this.getRoles()
		};
	}
	
	public getMessage(): I.Message {
		return this.buildParts(this.message.message.message)
	}

	public buildParts(message: any): I.MessagePart[] {
		const parts = [];
		message.forEach((piece) => {
			if (piece.type === 'text') {
				if (piece.text === '' || piece.text === ' ') return;

				piece.text.split(' ').forEach(bit => {
					if (bit === '' || bit === ' ') return;
	
					parts.push({
						type: 'text',
						text: bit
					});
				});
			} else if (piece.type === 'emoticon') {
				parts.push({
					type: 'emoticon',
					text: piece.text,
					identifier: {
						type: 'sprite',
						url: (piece.source !== 'external') ? `https://mixer.com/_latest/emoticons/${piece.pack}.png` : piece.pack,
						coords: piece.coords
					}
				});
			} else if (piece.type === 'tag') {
				parts.push({
					type: 'mention',
					text: piece.text,
					identifier: piece.username
				});
			}
			else if (piece.type === 'link') {
				parts.push({
					type: 'url',
					text: piece.text,
					identifier: piece.url
				});
			}
		});

		return parts;
	}

	public static parse(message: I.MixerRawMessage) {
		return new MixerParser(message).get();
	}
}