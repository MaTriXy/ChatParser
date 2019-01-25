import { expect } from 'chai';

import { TwitchParser } from "../../src/services/Twitch";
import { basic_message, complicated_role, jar_roles, bot_roles, command, tag, noEmotes } from "../fixtures/twitch-chat";
import { Roles } from '../../src/roles';
import { IPlatform } from '../../src/types/Platform';

describe('Twitch', async () => {
    let twitch : TwitchParser;

    beforeEach(() => {
        twitch = new TwitchParser({ developers: ['2'], bots: ['3'] });
    });

    describe('chat', () => {
        it('parses messages', async () => {
            const parse = await twitch.parseMessage(basic_message)

            expect(parse.metadata.command).to.equal(false);
            expect(parse.metadata.description).to.equal('test');
            expect(parse.messageId).to.equal("b80c999d-31b6-4dd8-a708-27d249a672fe");
            expect(parse.platform).to.equal(IPlatform.Twitch);
            expect(parse.raw).to.equal(basic_message);
            expect(parse.user).to.deep.equal({
                userId: 1,
                username: 'StreamJar',
                primaryRole: Roles.USER,
                roles: [Roles.USER],
            });
            expect(parse.message).to.have.length(1);
            expect(parse.message[0]).to.deep.equal({
                type: 'text',
                text: 'test'
            });
        });

        describe('segments', () => {
            it('parses correctly', async () => {
                const parse = await twitch.parseMessage(complicated_role)

                expect(parse.message).to.have.length(5);
            });

            it('parses text', async () => {
                const parse = await twitch.parseMessage(basic_message)

                expect(parse.message[0].text).to.equal('test');
                expect(parse.message[0].type).to.equal('text');
            });

            it('parses emotes - built-in', async () => {
                const parse = await twitch.parseMessage(complicated_role)

                expect(parse.message[1].text).to.equal(':D');
                expect(parse.message[1].type).to.equal('emoticon');
                expect((<any>parse.message[1].identifier).type).to.equal('direct');
                expect((<any>parse.message[1].identifier).url).to.equal('http://static-cdn.jtvnw.net/emoticons/v1/3/1.0');
            });

            it('parses emotes - link', async () => {
                const parse = await twitch.parseMessage(complicated_role)

                expect(parse.message[3].text).to.equal('https://google.com');
                expect(parse.message[3].type).to.equal('url');
            });

            it('parses mention - tag', async () => {
                const parse = await twitch.parseMessage(complicated_role)

                expect(parse.message[4].text).to.equal('@StreamJar');
                expect(parse.message[4].type).to.equal('mention');
            });
        })

        it('parses multiple roles', async () => {
            const parse = await twitch.parseMessage(complicated_role);

            expect(parse.user.roles).to.have.length(5);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.MODERATOR);
            expect(parse.user.roles).to.include(Roles.STAFF);
            expect(parse.user.roles).to.include(Roles.SUBSCRIBER);

            expect(parse.user.primaryRole).to.equal(Roles.OWNER);
        });

        it('handles a user being streamjar', async () => {
            const parse = await twitch.parseMessage(jar_roles);

            expect(parse.user.roles).to.have.length(6);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.DEVELOPER);

            expect(parse.user.primaryRole).to.equal(Roles.DEVELOPER);
        });

        it('handles a user being a bot', async () => {
            const parse = await twitch.parseMessage(bot_roles);

            expect(parse.user.roles).to.have.length(2);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.BOT);

            expect(parse.user.primaryRole).to.equal(Roles.BOT);
        });

        it('detects a command being a command', async () => {
            const parse = await twitch.parseMessage(command);

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });

        it('detects a command being a command via tag', async () => {
            const parse = await twitch.parseMessage(tag, 'StreamJar');

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });

		it('handles no emotes', async () => {
            const parse = await twitch.parseMessage(noEmotes, 'StreamJar');

            expect(parse.metadata.command).to.equal(false);
            expect(parse.message.length).to.equal(1);
            expect(parse.message[0].type).to.equal('text');
        });
    });
});
