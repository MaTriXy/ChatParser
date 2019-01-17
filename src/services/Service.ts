import { IMessage, IMessageSegment, IContext, IMessageMetadata } from "../types/Message";
import { IPlatform } from "../types/Platform";
import { RawMessage } from "../types/RawMessages";
import { RawEvent } from "../types/RawEvent";
import { IServiceConfig } from "../types/Config";
import { Role } from "../roles";

export abstract class Service<T extends RawMessage, P extends RawEvent> {
    constructor(protected config: IServiceConfig) {}

    protected abstract getPlatform(): IPlatform;
    protected abstract getMessageContext(message: T): IContext;
    protected abstract getMessageId(message: T): string | null;
    protected abstract getMessageSegments(message: T): IMessageSegment[];
    protected abstract getEventContext(message: P): IContext;

    protected sortRoles(roles: Role[]): Role[] {
        return roles.sort((a, b) => a.hasPermission(b) ? 1 : -1);
    }

    private getMeta(segments: IMessageSegment[], botName): IMessageMetadata {
        const meta: { command: boolean, commandName?: string, description: string } = { command: false, description: '' };
        let strip = 0;

        if (botName && segments.length >= 2 && segments[0].type === 'mention' && ((<string>segments[0].identifier).toLowerCase() === botName.toLowerCase())) {
            meta.command = true;
            meta.commandName = segments[1].text.toLowerCase();
            strip = 2;
        } else if (segments[0].text.startsWith('!')) {
            meta.command = true;
            meta.commandName = segments[0].text.replace('!', '').toLowerCase();
            strip = 1;
        }

        meta.description = segments.slice(strip).map(a => a.text).join(' ');

        return meta;
    }

    public parseMessage(message: T, botName?: string): IMessage {
        const segments = this.getMessageSegments(message);

        return {
            platform: this.getPlatform(),
            message: segments,
            messageId: this.getMessageId(message),
            user: this.getMessageContext(message),
            metadata: this.getMeta(segments, botName),
            raw: message,
        }
    };

    public parseJoin(event: P): IContext {
        return this.getEventContext(event);
    }
}
