import { expect } from 'chai';

import * as Example from '../../examples';
import { Parser } from '../../src';
import { IChatRole, ChatPlatform } from '../../src/interfaces';

describe("Parses Youtube", () => {
	let parser;
	let parsed;
		
	beforeEach(() => {
		parser = new Parser();
		parsed = parser.parseMessage(ChatPlatform.Youtube, Example.youtubeJSON);
	});


	describe('has basic info', () => {
		it("Should parse without error", () => {
			expect(parsed).to.have.property('user');
			expect(parsed).to.have.property('raw');
			expect(parsed).to.have.property('message');
		});

		it('Thinks the user is the streamer', () => {
			expect(parsed.user.roles).to.contain(IChatRole.Owner);
		});

		it('Thinks the user is a moderator', () => {
			expect(parsed.user.roles).to.contain(IChatRole.Moderator);
		});

		it('Thinks the user is a sponsor', () => {
			expect(parsed.user.roles).to.contain(IChatRole.Subscriber);
		});

		it("Should have the correct user object", () => {
			expect(parsed.user.username).to.equal('StreamJar');
			expect(parsed.user.userId).to.equal("UCHcE6_xxE2-9NMY9hDX_cfw");
		});
	})

	describe('parses message correctly', () => {
		it('has the right number of components', () => {
			expect(parsed.message).to.have.length(6);
		})

		it('begins with text', () => {
			expect(parsed.message[0].type).to.equal('text');
		})

		it('has an emote which is a sprite', () => {
			expect(parsed.message[1].type).to.equal('emoticon');
			expect(parsed.message[1].identifier.type).to.equal('direct');
		})

		it('has an url to google', () => {
			expect(parsed.message[3].type).to.equal('url');
			expect(parsed.message[3].identifier).to.equal('https://google.com');
		})


		it('contains a mention', () => {
			expect(parsed.message[4].type).to.equal('mention');
			expect(parsed.message[4].identifier).to.equal('StreamJar2');
		})

		it('doesn\'t turn javascript methods into emotes', () => {
			expect(parsed.message[5].type).to.equal('text');
		});
	})
});
