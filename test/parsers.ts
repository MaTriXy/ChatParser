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

	it("Should parse Beam", () => {
		chai.expect(parser.parseMessage(Platforms.Beam, Example.beamJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Beam, Example.beamJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Beam, Example.beamJSON)).to.have.property('message');
	});

	it("Should parse Twitch", () => {
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Twitch, Example.twitchJSON.string)).to.have.property('message');
	});

	it("Should parse Hitbox", () => {
		chai.expect(parser.parseMessage(Platforms.Hitbox, Example.hitboxJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Hitbox, Example.hitboxJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Hitbox, Example.hitboxJSON)).to.have.property('message');
	});

	it("Should parse Youtube", () => {
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('user');
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('raw');
		chai.expect(parser.parseMessage(Platforms.Youtube, Example.youtubeJSON)).to.have.property('message');
	});
});

import './parsers/Beam';
import './parsers/Twitch';
import './parsers/Hitbox';
import './parsers/Youtube';
