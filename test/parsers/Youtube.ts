import * as Example from '../../examples';
import { default as Parser, Platforms } from '../../';
import * as chai from 'chai';
import { } from '@types/chai';
import { } from '@types/mocha';

describe("Parses Youtube", () => {
	let parser;
	let parsed;
		
	beforeEach(() => {
		parser = new Parser();
		parsed = parser.parseMessage(Platforms.Youtube, Example.youtubeJSON);
	});


	describe('has basic info', () => {
		it("Should parse without error", () => {
			chai.expect(parsed).to.have.property('user');
			chai.expect(parsed).to.have.property('raw');
			chai.expect(parsed).to.have.property('message');
		});

		it('Thinks the user is the streamer', () => {
			chai.expect(parsed.user.roles).to.contain('Streamer');
		});

		it('Thinks the user is a moderator', () => {
			chai.expect(parsed.user.roles).to.contain('Mod');
		});

		it('Thinks the user is a sponser', () => {
			chai.expect(parsed.user.roles).to.contain('Subscriber');
		});

		it('Thinks the user is the streamer', () => {
			chai.expect(parsed.user.roles).to.contain('Streamer');
		});

		it("Should have the correct user object", () => {
			chai.expect(parsed.user.username).to.equal('StreamJar');
			chai.expect(parsed.user.userId).to.equal("UCHcE6_xxE2-9NMY9hDX_cfw");
		});
	})

	describe('parses message correctly', () => {
		it('has the right number of components', () => {
			chai.expect(parsed.message).to.have.length(6);
		})

		it('begins with text', () => {
			chai.expect(parsed.message[0].type).to.equal('text');
		})

		it('has an emote which is a sprite', () => {
			chai.expect(parsed.message[1].type).to.equal('emoticon');
			chai.expect(parsed.message[1].identifier.type).to.equal('direct');
		})

		it('has an url to google', () => {
			chai.expect(parsed.message[3].type).to.equal('url');
			chai.expect(parsed.message[3].identifier).to.equal('https://google.com');
		})


		it('contains a mention', () => {
			chai.expect(parsed.message[4].type).to.equal('mention');
			chai.expect(parsed.message[4].identifier).to.equal('StreamJar2');
		})

		it('doesn\'t turn javascript methods into emotes', () => {
			chai.expect(parsed.message[5].type).to.equal('text');
		});
	})
});