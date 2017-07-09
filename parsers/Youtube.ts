import * as I from '../interfaces';
import { Parser } from './Parser';
import * as emojiRegex from 'emoji-regex'; // tslint:disable-line noImplicitAny

export class YoutubeParser extends Parser<I.YoutubeRawMessage> {
	public type = 'youtube';

	public static parse(message: I.YoutubeRawMessage) {
		return new YoutubeParser(message).get();
	}

	constructor(message: I.YoutubeRawMessage) {
		super(message);
	}

	public getRoles(): I.Role[] {
		const res: I.Role[] = [];

		if (this.message.authorDetails.isChatOwner) {
			res.push('owner');
		}

		if (this.message.authorDetails.isChatModerator) {
			res.push('moderator');
		}

		if (this.message.authorDetails.isChatSponsor) {
			res.push('subscriber');
		}

		return res;
	}

	public getUser(): I.User {
		return {
			username: this.message.authorDetails.displayName,
			userId: this.message.authorDetails.channelId,
			roles: this.getRoles(),
		};
	}

	public getMessage(): I.MessagePart[] {
		return this.buildParts();
	}

	public buildParts(): I.MessagePart[] {
		const parts: I.MessagePart[] = [];
		const words = this.message.snippet.displayMessage.split(' ');

		words.forEach(string => {
			if (string.match(emojiRegex())) {
				parts.push({
					type: 'emoticon',
					text: 'Native Emoji',
					identifier: {
						type: 'direct',
						url: `https://gaming.youtube.com/s/gaming/emoji/6281e215/emoji_u${string.charCodeAt(0).toString(16)}.svg`,
					}
				})
			} else if (string.indexOf('@') === 0) {
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
}
