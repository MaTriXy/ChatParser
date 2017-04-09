import * as Example from '../../examples';
import { default as Parser, Platforms } from '../../';
import * as chai from 'chai';
import { } from '@types/chai';
import { } from '@types/mocha';

describe("Parses Hitbox", () => {
	let parser;
	let parsed;

	describe('works without emotes', () => {
		beforeEach(() => {
			parser = new Parser();
			parsed = parser.parseMessage(Platforms.Hitbox, Example.hitboxJSON);
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

			it('Thinks the user is staff', () => {
				chai.expect(parsed.user.roles).to.contain('Staff');
			});


			it('Thinks the user is a mod', () => {
				chai.expect(parsed.user.roles).to.contain('Mod');
			});

		it('Thinks the user is a subscriber', () => {
				chai.expect(parsed.user.roles).to.contain('Subscriber');
			});

			it("Should have the correct user object", () => {
				chai.expect(parsed.user.username).to.equal('StreamJar');
				chai.expect(parsed.user.userId).to.equal(null);
			});
		})

		describe('parses message correctly', () => {
			it('has the right number of components', () => {
				chai.expect(parsed.message).to.have.length(6);
			})

			it('begins with text', () => {
				chai.expect(parsed.message[0].type).to.equal('text');
			})

			it('doesn\'t see the emoticon', () => {
				chai.expect(parsed.message[1].type).to.equal('text');
			})

			it('has an url to google', () => {
				chai.expect(parsed.message[3].type).to.equal('url');
				chai.expect(parsed.message[3].identifier).to.equal('https://google.com');
			})


			it('contains a mention', () => {
				chai.expect(parsed.message[4].type).to.equal('mention');
				chai.expect(parsed.message[4].identifier).to.equal('StreamJar');
			})
		})
	});

	describe('works with emotes', () => {
		let parserEm;
		
		beforeEach(() => {
			parserEm = new Parser();
			parserEm.loadHitboxEmotes(Example.hitboxEmotesJSON);
			parsed = parserEm.parseMessage(Platforms.Hitbox, Example.hitboxJSON);
		});

		it('sees the emoticon', () => {
			chai.expect(parsed.message[1].type).to.equal('emoticon');
		})

		it('sees the emoticon as direct', () => {
			chai.expect(parsed.message[1].identifier.type).to.equal('direct');
		})

		it('doesn\'t turn javascript methods into emotes', () => {
			chai.expect(parsed.message[5].type).to.equal('text');
		});
	})
});
