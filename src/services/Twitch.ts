import { Service } from './Service';
import { IMessageSegment, IContext } from '../types/Message';
import { IPlatform } from '../types/Platform';
import { Roles } from '../roles';
import { TwitchRawMessage } from '../types/RawMessages';

export class TwitchParser extends Service<TwitchRawMessage, any> {

	protected getPlatform(): IPlatform {
		return IPlatform.Twitch;
    }

	private parseMeta(message: TwitchRawMessage): { [key: string]: string } {
		const arr = {};
		const parts = message.raw.substring(1).split(" :")[0].split(";");

		parts.forEach((data) => {
			var ex = data.split('=');
			arr[ex[0]] = ex[1];
		});

		return arr;
    }

    private mapEmotes(message: TwitchRawMessage, raw: string) {
        const map = {};
        const meta = this.parseMeta(message);

		meta['emotes'].split('/').forEach(emote => {
			const mapping = emote.split(':');
			const range = mapping[1].split('-');
			const emoteText = raw.substring(parseInt(range[0], 10), parseInt(range[1], 10) + 1);
			map[emoteText] = parseInt(mapping[0], 10);
        });

        return map;
	}

    private checkBadges(metadata: { [key: string]: string }, role: string): boolean {
        const badges = metadata['badges'].split(",");

        return badges.some(a => a === `${role}/1`);
	}

    private getChatMessage(message: TwitchRawMessage): string {
		return message.raw.split(" ").slice(4).join(" ").substring(1).replace(/\r?\n|\r/g, '');
    }

	private getRoles(metadata: { [key: string]: string }, userId: string) {
		const roles = [Roles.USER];

		if (this.checkBadges(metadata, 'broadcaster')) {
			roles.push(Roles.OWNER);
		}

		if (metadata['subscriber'] === '1') {
			roles.push(Roles.SUBSCRIBER);
		}

		if (metadata['mod'] === '1') {
			roles.push(Roles.MODERATOR);
		}

		if (['global_mod', 'admin', 'staff'].indexOf(metadata['user-type']) !== -1) {
			roles.push(Roles.STAFF);
		}

		if (this.config.developers.indexOf(userId) !== -1) {
			roles.push(Roles.DEVELOPER);
		}

		if (this.config.bots.indexOf(userId) !== -1) {
			roles.push(Roles.BOT);
		}

		return this.sortRoles(roles);
	}

	protected getMessageContext(message: TwitchRawMessage): IContext {
        const meta = this.parseMeta(message);
		const roles = this.getRoles(meta, meta['user-id']);

		return {
			userId: +meta['user-id'],
			username: meta['display-name'],
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getEventContext(message: TwitchRawMessage): IContext {
        const meta = this.parseMeta(message);
        const roles = this.getRoles(meta, meta['user-id']);

		return {
			userId: +meta['user-id'],
			username: meta['display-name'],
			primaryRole: roles[0],
			roles: roles,
		}
	}

	protected getMessageId(): string {
		return null;
	}

	protected getMessageSegments(message: TwitchRawMessage): IMessageSegment[] {
        const parts: IMessageSegment[] = [];
        const rawStr = this.getChatMessage(message);
        const emoteMapping = this.mapEmotes(message, rawStr);

        rawStr.split(' ').forEach(string => {
			if (typeof emoteMapping[string] === 'number') {
				parts.push({
					type: 'emoticon',
					text: string,
					identifier: {
						type: 'direct',
						url: `http://static-cdn.jtvnw.net/emoticons/v1/${emoteMapping[string]}/1.0`,
					}
				});
			} else if (string.indexOf("@") == 0) {
				parts.push({
					type: 'mention',
					text: string,
					identifier: string.replace('@', '')
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
