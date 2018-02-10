export interface MixerRawMessage {
	channel: string,
	id: string,
	user_name: string,
	user_id: number,
	user_roles: string[],
	user_level: number,
	message: { message: any, meta: any },
}

export interface TwitchRawMessage {
	raw: string,
}

export interface SmashcastRawMessage {
	channel: string,
	name: string,
	nameColor: string,
	text: string,
	time: number,
	id: string,
	role: string,
	isFollower: boolean,
	isSubscriber: boolean,
	isOwner: boolean,
	isStaff: boolean,
	isCommunity: boolean,
	media: boolean,
	image: string,
}

export interface YoutubeRawMessage {
	kind: string;
	etag: string;
	id: string;

	snippet: {
		type: string;
		liveChatId: string;
		authorChannelId: string;
		publishedAt: string;
		hasDisplayContent: boolean;
		displayMessage: string;
		textMessageDetails: any; // eh
	};

	authorDetails: {
		channelId: string;
		channelUrl: string;
		displayName: string;
		profileImageUrl: string;
		isVerified: boolean;
		isChatOwner: boolean;
		isChatSponsor: boolean;
		isChatModerator: boolean;
	}
}

export interface IMessagePart {
	type: string,
	text: string,
	identifier?: string | { type: string, url: string, coords: any };
}

export interface IMessageContext {
	userId: string,
	username: string,
	roles: IChatRole[],
}

export enum IChatRole {
	User = 'user',
	Subscriber = 'subscriber',
	Moderator = 'moderator',
	Editor = 'editor',
	Staff = 'staff',
	Owner = 'owner',
}

export enum ChatPlatform {
	Mixer = 'mixer',
	Twitch = 'twitch',
	Smashcast = 'smashcast',
	Youtube = 'youtube',
}

export interface IChatMessage {
	platform: ChatPlatform,
	user: IMessageContext,
	message: IMessagePart[],
	raw: MixerRawMessage | TwitchRawMessage | YoutubeRawMessage | SmashcastRawMessage,
}