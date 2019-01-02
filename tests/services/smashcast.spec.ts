import { basic_message, complicated_message, command, command_mention } from './../fixtures/smashcast-chat';
import { SmashcastParser } from './../../src/services/Smashcast';
import { expect } from 'chai';

import { Roles } from '../../src/roles';
import { IPlatform } from '../../src/types/Platform';

describe('Smashcast', () => {
    let smashcast : SmashcastParser;

    beforeEach(() => {
        smashcast = new SmashcastParser({ developers: [], bots: [] });
    });

    describe('chat', () => {
        it('parses messages', () => {
            const parse = smashcast.parseMessage(basic_message)

            expect(parse.metadata.command).to.equal(false);
            expect(parse.metadata.description).to.equal('test');
            expect(parse.messageId).to.equal(basic_message.id);
            expect(parse.platform).to.equal(IPlatform.Smashcast);
            expect(parse.raw).to.equal(basic_message);
            expect(parse.user).to.deep.equal({
                userId: null,
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
                const parse = smashcast.parseMessage(complicated_message)

                expect(parse.message).to.have.length(5);
            });

            it('parses text', () => {
                const parse = smashcast.parseMessage(basic_message)

                expect(parse.message[0].text).to.equal('test');
                expect(parse.message[0].type).to.equal('text');
            });

            it('parses emotes - built-in', () => {
                const parse = smashcast.parseMessage(complicated_message)

                expect(parse.message[1].text).to.equal(':D');
                expect(parse.message[1].type).to.equal('text');
            });

            it('parses emotes - link', () => {
                const parse = smashcast.parseMessage(complicated_message)

                expect(parse.message[3].text).to.equal('https://google.com');
                expect(parse.message[3].type).to.equal('url');
            });

            it('parses mention - tag', () => {
                const parse = smashcast.parseMessage(complicated_message)

                expect(parse.message[4].text).to.equal('@StreamJar');
                expect(parse.message[4].type).to.equal('mention');
            });
        })

        it('parses multiple roles', () => {
            const parse = smashcast.parseMessage(complicated_message);

            expect(parse.user.roles).to.have.length(5);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.MODERATOR);
            expect(parse.user.roles).to.include(Roles.STAFF);
            expect(parse.user.roles).to.include(Roles.SUBSCRIBER);

            expect(parse.user.primaryRole).to.equal(Roles.OWNER);
        });

        it('detects a command being a command', () => {
            const parse = smashcast.parseMessage(command);

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });

        it('detects a command being a command via tag', () => {
            const parse = smashcast.parseMessage(command_mention, 'StreamJar');

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('@Luke');
        });
    });
});
