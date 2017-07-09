export interface MixerRawMessage {
	channel: string;
	id: string;
	user_name: string;
	user_id: number;
	user_roles: string[];
	user_level: number;
	message: { message: any; meta: any };
}

export interface TwitchRawMessage {
	raw: string;
}

export interface SmashcastRawMessage {
	channel: string;
	name: string;
	nameColor: string;
	text: string;
	time: number;
	id: string;
	role: string;
	isFollower: boolean;
	isSubscriber: boolean;
	isOwner: boolean;
	isStaff: boolean;
	isCommunity: boolean;
	media: boolean;
	image: string;
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
	};
}

export interface Message {
	platform: string;
	user: User;
	message: MessagePart[];
	raw: any;
}

export interface MessagePart {
	type: 'text' | 'mention' | 'url' | 'emoticon';
	text: string;
	identifier?: string | EmoticonIdentifier;
}

export interface EmoticonIdentifier {
	type: 'sprite' | 'direct';
	url: string;
	coords?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export interface User {
	userId: string | number | null;
	username: string;
	roles: Role[];
}

export type Role = 'owner' | 'staff' | 'moderator' | 'subscriber' | 'premium';
