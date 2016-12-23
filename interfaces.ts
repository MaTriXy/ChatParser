export interface BeamRawMessage {
	channel: String,
	id: String,
	user_name: String,
	user_id: Number,
	user_roles: String[],
	user_level: Number,
	message: { message: any, meta: any },
}

export interface TwitchRawMessage {
	raw: String,
}

export interface HitboxRawMessage {
	channel: String,
	name: String,
	nameColor: String,
	text: String,
	time: Number,
	id: String,
	role: String,
	isFollower: Boolean,
	isSubscriber: Boolean,
	isOwner: Boolean,
	isStaff: Boolean,
	isCommunity: Boolean,
	media: Boolean,
	image: String,
}

export interface Message {
}

export interface MessagePart {
	type: String,
	text: String,
}

export interface User {
	userId: any,
	username: String,
	roles: String[],
}