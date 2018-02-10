import { Parser } from './Parser';
import { IChatRole, IMessagePart, IMessageContext, MixerRawMessage, IChatMessage, ChatPlatform } from '../interfaces';

export class MixerParser extends Parser<MixerRawMessage> {
	type = ChatPlatform.Mixer;
	
	public getRoles(): IChatRole[] {
		return <IChatRole[]>this.message.user_roles.map(role => {
			if (['Founder', 'Staff'].indexOf(role) !== -1) {
				return IChatRole.Staff;
			}

			if (role === 'Owner') {
				return IChatRole.Owner;
			}

			if (role === 'Mod') {
				return IChatRole.Moderator;
			}
			
			if (role === 'ChannelEditor') {
				return IChatRole.Editor;
			}

			if (role === 'Subscriber') {
				return IChatRole.Subscriber;
			}

			if (role === 'User') {
				return IChatRole.User;
			}

			return false;
		}).filter(a => a !== false);
	}
	
	public getUser(): IMessageContext {
		return {
			userId: String(this.message.user_id),
			username: this.message.user_name,
			roles: this.getRoles(),
		};
	}
	
	public getMessage(): IMessagePart[] {
		return this.buildParts(this.message.message.message)
	}

	public buildParts(message: any): IMessagePart[] {
		const parts: IMessagePart[] = [];

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

	public static parse(message: MixerRawMessage): IChatMessage {
		return new MixerParser(message).get();
	}
}