export interface RawMessage {

}

export interface MixerRawMessage extends RawMessage {
	channel: number,
	id: string,
	user_name: string,
	user_id: number,
	user_roles: string[],
	user_level: number,
	message: { message: any, meta: any },
}

export interface TwitchRawMessage extends RawMessage {
	raw: string,
}

export interface SmashcastRawMessage extends RawMessage {
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

export interface YoutubeRawMessage extends RawMessage {
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