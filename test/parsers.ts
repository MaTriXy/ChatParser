import { expect } from 'chai';

import * as Example from '../examples';
import { Parser } from '../src';

import 'mocha';
import 'chai';

describe("Parses Chat", () => {
	let parser;
	
	beforeEach(() => {
		parser = new Parser();
	});

	it("Should parse Mixer", () => {
		expect(parser.parseMessage(ChatPlatform.Mixer, Example.mixerJSON))
			.to.have.all.keys('user', 'platform', 'raw', 'message');
	});
	
	it("Should parse Twitch", () => {
		expect(parser.parseMessage(ChatPlatform.Twitch, Example.twitchJSON.string))
			.to.have.all.keys('user', 'platform', 'raw', 'message');
	});
	
	it("Should parse Smashcast", () => {
		expect(parser.parseMessage(ChatPlatform.Smashcast, Example.smashcastJSON))
			.to.have.all.keys('user', 'platform', 'raw', 'message');
	});

	it("Should parse Youtube", () => {
		expect(parser.parseMessage(ChatPlatform.Youtube, Example.youtubeJSON))
			.to.have.all.keys('user', 'platform', 'raw', 'message');
	});
});

import './parsers/Mixer';
import './parsers/Twitch';
import './parsers/Smashcast';
import './parsers/Youtube';import { ChatPlatform } from '../src/interfaces';

