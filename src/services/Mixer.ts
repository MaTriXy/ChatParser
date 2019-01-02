import { Service } from './Service';
import { IMessageSegment, IContext } from '../types/Message';
import { IPlatform } from '../types/Platform';
import { Roles, Role } from '../roles';
import { MixerRawEvent } from '../types/RawEvent';
import { MixerRawMessage } from '../types/RawMessages';

export class MixerParser extends Service<MixerRawMessage, MixerRawEvent> {

	protected getPlatform(): IPlatform {
		return IPlatform.Mixer;
	}

	private getRoles(userRoles: string[], userId: number): Role[] {
		const roles = <Role[]>userRoles.map(role => {
			if (['Founder', 'Staff'].indexOf(role) !== -1) {
				return Roles.STAFF;
			}

			if (role === 'Owner') {
				return Roles.OWNER;
			}

			if (role === 'Mod') {
				return Roles.MODERATOR;
			}

			if (role === 'ChannelEditor') {
				return Roles.EDITOR;
			}

			if (role === 'Subscriber') {
				return Roles.SUBSCRIBER;
			}

			if (role === 'User') {
				return Roles.USER;
			}

			return false;
		}).filter(a => a !== false);

		if (this.config.developers.indexOf(userId) !== -1) {
			roles.push(Roles.DEVELOPER);
		}

		if (this.config.bots.indexOf(userId) !== -1) {
			roles.push(Roles.BOT);
		}

		return this.sortRoles(roles);
	}

	protected getMessageContext(message: MixerRawMessage): IContext {
		const roles = this.getRoles(message.user_roles, message.user_id);

		return {
			userId: +message.user_id,
			username: message.user_name,
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getEventContext(message: MixerRawEvent): IContext {
		const roles = this.getRoles(message.roles, message.id);

		return {
			userId: +message.id,
			username: message.username,
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getMessageId(message: MixerRawMessage): string {
		return message.id;
	}

	protected getMessageSegments(message: MixerRawMessage): IMessageSegment[] {
        const parts: IMessageSegment[] = [];

		message.message.message.forEach((piece) => {
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
}
