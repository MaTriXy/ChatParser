import { expect } from 'chai';

import { TwitchParser } from "../../src/services/twitch";
import { basic_message, complicated_role, jar_roles, bot_roles, command, tag } from "../fixtures/twitch-chat";
import { Roles } from '../../src/roles';
import { IPlatform } from '../../src/types/Platform';

describe('Twitch', () => {
    let twitch : TwitchParser;

    beforeEach(() => {
        twitch = new TwitchParser({ developers: ['2'], bots: ['3'] });
    });

    describe('chat', () => {
        it('parses messages', () => {
            const parse = twitch.parseMessage(basic_message)

            expect(parse.metadata.command).to.equal(false);
            expect(parse.metadata.description).to.equal('test');
            expect(parse.messageId).to.equal(null);
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
            it('parses correctly', () => {
                const parse = twitch.parseMessage(complicated_role)

                expect(parse.message).to.have.length(5);
            });

            it('parses text', () => {
                const parse = twitch.parseMessage(basic_message)

                expect(parse.message[0].text).to.equal('test');
                expect(parse.message[0].type).to.equal('text');
            });

            it('parses emotes - built-in', () => {
                const parse = twitch.parseMessage(complicated_role)

                expect(parse.message[1].text).to.equal(':D');
                expect(parse.message[1].type).to.equal('emoticon');
                expect((<any>parse.message[1].identifier).type).to.equal('direct');
                expect((<any>parse.message[1].identifier).url).to.equal('http://static-cdn.jtvnw.net/emoticons/v1/3/1.0');
            });

            it('parses emotes - link', () => {
                const parse = twitch.parseMessage(complicated_role)

                expect(parse.message[3].text).to.equal('https://google.com');
                expect(parse.message[3].type).to.equal('url');
            });

            it('parses mention - tag', () => {
                const parse = twitch.parseMessage(complicated_role)

                expect(parse.message[4].text).to.equal('@StreamJar');
                expect(parse.message[4].type).to.equal('mention');
            });
        })

        it('parses multiple roles', () => {
            const parse = twitch.parseMessage(complicated_role);

            expect(parse.user.roles).to.have.length(5);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.MODERATOR);
            expect(parse.user.roles).to.include(Roles.STAFF);
            expect(parse.user.roles).to.include(Roles.SUBSCRIBER);

            expect(parse.user.primaryRole).to.equal(Roles.OWNER);
        });

        it('handles a user being streamjar', () => {
            const parse = twitch.parseMessage(jar_roles);

            expect(parse.user.roles).to.have.length(6);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.DEVELOPER);

            expect(parse.user.primaryRole).to.equal(Roles.DEVELOPER);
        });

        it('handles a user being a bot', () => {
            const parse = twitch.parseMessage(bot_roles);

            expect(parse.user.roles).to.have.length(2);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.BOT);

            expect(parse.user.primaryRole).to.equal(Roles.BOT);
        });

        it('detects a command being a command', () => {
            const parse = twitch.parseMessage(command);

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });

        it('detects a command being a command via tag', () => {
            const parse = twitch.parseMessage(tag, 'StreamJar');

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });
    });
});
