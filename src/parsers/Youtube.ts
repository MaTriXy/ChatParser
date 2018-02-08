import { Parser } from './Parser';
import * as emojiRegex from 'emoji-regex';
import { IChatRole, YoutubeRawMessage, IMessageContext, IMessagePart, IChatMessage, ChatPlatform } from '../interfaces';

export class YoutubeParser extends Parser<YoutubeRawMessage> {
	type = ChatPlatform.Youtube;

	constructor(message: YoutubeRawMessage) {
		super(message);
	}

	public getRoles(): IChatRole[] {
		const res = [IChatRole.User];

		if (this.message.authorDetails.isChatModerator) {
			res.push(IChatRole.Moderator);			
		}

		if (this.message.authorDetails.isChatOwner) {
			res.push(IChatRole.Owner);			
		}

		if (this.message.authorDetails.isChatSponsor) {
			res.push(IChatRole.Subscriber);			
		}

		if (this.message.authorDetails.isChatModerator) {
			res.push(IChatRole.Moderator);			
		}
		
        return res;
	}

	public getUser(): IMessageContext {
		return {
			username: this.message.authorDetails.displayName,
			userId: this.message.authorDetails.channelId,
			roles: this.getRoles(),
		};
	}
	
	public getMessage(): IMessagePart[] {
		return this.buildParts();
	}

	public buildParts(): IMessagePart[] {
		const parts = [];
		const words = this.message.snippet.displayMessage.split(" ");

		words.forEach(string => {
			if (string.match(emojiRegex())) {
				parts.push({ 
					type: 'emoticon',
					text: "Native Emoji",
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

	public static parse(message: YoutubeRawMessage): IChatMessage {
		return new YoutubeParser(message).get();
	}
}