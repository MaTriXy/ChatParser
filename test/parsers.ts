import * as Example from '../examples';
import { default as Parser, Platforms } from '../';
import * as chai from 'chai';
import { } from '@types/chai';
import { } from '@types/mocha';

describe("Parses Chat", () => {
	let parser;
	
	beforeEach(() => {
		parser = new Parser();
	});

	it("Should parse Mixer", () => {
		chai.expect(parser.parseMessage(Platforms.Mixer, Example.mixerJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Mixer, Example.mixerJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Mixer, Example.mixerJSON)).to.have.property('message');
	});

	it("Should parse Twitch", () => {
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('message');
	});

	it("Should parse Smashcast", () => {
		chai.expect(parser.parseMessage(Platforms.Smashcast, Example.smashcastJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Smashcast, Example.smashcastJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Smashcast, Example.smashcastJSON)).to.have.property('message');
	});

	it("Should parse Youtube", () => {
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('message');
	});
});

import './parsers/Mixer';
import './parsers/Twitch';
import './parsers/Smashcast';
import './parsers/Youtube';
