import { SmashcastRawMessage } from './../types/RawMessages';
import { Service } from './Service';
import { IMessageSegment, IContext } from '../types/Message';
import { IPlatform } from '../types/Platform';
import { Roles } from '../roles';

export class SmashcastParser extends Service<SmashcastRawMessage, any> {
	private findUser: (username: string) => Promise<number> = () => Promise.resolve(null);

	public setUserIdentifier(fn: (username: string) => Promise<number>): void {
		this.findUser = fn;
	}

	protected getPlatform(): IPlatform {
		return IPlatform.Smashcast;
    }

	private getRoles(message: SmashcastRawMessage) {
		const roles = [Roles.USER];

		if (message.isOwner) {
			roles.push(Roles.OWNER);
		}

		if (message.isSubscriber) {
			roles.push(Roles.SUBSCRIBER);
		}

		// how the !@£$ does this make sense?
		if (message.role === 'user') {
			roles.push(Roles.MODERATOR);
		}

		if (message.isStaff || message.isCommunity) {
			roles.push(Roles.STAFF);
		}

		return this.sortRoles(roles);
	}

	protected async getMessageContext(message: SmashcastRawMessage): Promise<IContext> {
		const roles = this.getRoles(message);

		return {
			userId: await this.findUser(message.name).catch(() => null),
			username:  message.name,
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getEventContext(message: SmashcastRawMessage): IContext {
        const roles = this.getRoles(message);

		return {
			userId: null,
			username: message.name,
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getMessageId(message: SmashcastRawMessage): string {
		return message.id;
	}

	protected getMessageSegments(message: SmashcastRawMessage): IMessageSegment[] {
		const parts: IMessageSegment[] = [];

		/**
		 * Dear Smashcast,
		 * Why the hell are you sending HTML to handle links/inline images?!
		 *
		 * Regards,
		 * Luke @ StreamJar.
		 */
		let text = message.text.replace(/<a href=[\'"]?([^\'" >]+).+">(.*)<\/a>/g, "$1"); // We can handle URL parsing on our own.
		text = text.replace(/<div.+<\/div>/g, ''); // Strip out inline images

		text.split(" ").forEach((string: string) => {
			if (string.indexOf("@") == 0) {
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
