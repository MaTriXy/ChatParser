import * as I from '../interfaces';
import { Parser } from './Parser';
import * as emojiRegex from 'emoji-regex';
import * as gemoji from 'gemoji';

export class YoutubeParser extends Parser<I.YoutubeRawMessage> {
	type = 'youtube';

	constructor(message: I.YoutubeRawMessage) {
		super(message);
	}

	public getRoles(): String[] {
		const res = [];

		if (this.message.authorDetails.isChatModerator) {
			res.push("Mod");			
		}

		if (this.message.authorDetails.isChatOwner) {
			res.push("Streamer");			
		}

		if (this.message.authorDetails.isChatSponsor) {
			res.push("Subscriber");			
		}

		if (this.message.authorDetails.isChatModerator) {
			res.push("Moderator");			
		}
		
        return res;
	}

	public getChatMessage(): String {
		return "msg";
	}

	public getUser(): I.User {
		return {
			username: this.message.authorDetails.displayName,
			userId: this.message.authorDetails.channelId,
			roles: this.getRoles()
		};
	}
	
	public getMessage(): I.Message {
		return this.buildParts();
	}

	public buildParts(): I.MessagePart[] {
		const parts = [];
		const words = this.message.snippet.displayMessage.split(" ");

		words.forEach(string => {
			if (string.match(emojiRegex())) {
				console.log(string);
				parts.push({ 
					type: 'emoticon',
					text: gemoji.unicode[string],
					identifier: {
						type: 'direct',
						url: `https://gaming.youtube.com/s/gaming/emoji/6281e215/emoji_u${string.charCodeAt(0).toString(16)}.svg`,
					}
				})
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

	public static parse(message: I.YoutubeRawMessage) {
		return new YoutubeParser(message).get();
	}
}