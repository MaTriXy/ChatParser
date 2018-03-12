import { expect } from 'chai';

import { Mixer } from "../../src/services/Mixer";
import { basic_message, complicated_role, jar_roles, bot_roles, command, tag } from "../fixtures/mixer-chat";
import { Roles } from '../../src/roles';
import { IPlatform } from '../../src/types/Platform';
import { user_join, user_join_jar, user_join_bot } from '../fixtures/mixer-events';

describe('Mixer', () => {
    let mixer : Mixer;

    beforeEach(() => {
        mixer = new Mixer({ developers: [2], bots: [3] });
    });

    describe('chat', () => {
        it('parses messages', () => {
            const parse = mixer.parseMessage(basic_message)
    
            expect(parse.metadata.command).to.equal(false);
            expect(parse.metadata.description).to.equal('test');
            expect(parse.messageId).to.equal(basic_message.id);
            expect(parse.platform).to.equal(IPlatform.Mixer);
            expect(parse.raw).to.equal(basic_message);
            expect(parse.user).to.deep.equal({
                userId: '1',
                username: basic_message.user_name,
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
                const parse = mixer.parseMessage(complicated_role)

                expect(parse.message).to.have.length(5);
            });

            it('parses text', () => {
                const parse = mixer.parseMessage(basic_message)

                expect(parse.message[0].text).to.equal('test');
                expect(parse.message[0].type).to.equal('text');
            });
            
            it('parses emotes - built-in', () => {
                const parse = mixer.parseMessage(complicated_role)
    
                expect(parse.message[1].text).to.equal(':D');
                expect(parse.message[1].type).to.equal('emoticon');
                expect((<any>parse.message[1].identifier).type).to.equal('sprite');
                expect((<any>parse.message[1].identifier).url).to.equal('https://mixer.com/_latest/emoticons/default.png');
            });

            it('parses emotes - external', () => {
                const parse = mixer.parseMessage(complicated_role)
    
                expect(parse.message[2].text).to.equal(':(');
                expect(parse.message[2].type).to.equal('emoticon');
                expect((<any>parse.message[2].identifier).type).to.equal('sprite');
                expect((<any>parse.message[2].identifier).url).to.equal('https://google.com');
            });


            it('parses emotes - link', () => {
                const parse = mixer.parseMessage(complicated_role)
    
                expect(parse.message[3].text).to.equal('https://google.com');
                expect(parse.message[3].type).to.equal('url');
            });

            it('parses emotes - tag', () => {
                const parse = mixer.parseMessage(complicated_role)
    
                expect(parse.message[4].text).to.equal('@StreamJar');
                expect(parse.message[4].type).to.equal('mention');
            });
        })

        it('parses multiple roles', () => {
            const parse = mixer.parseMessage(complicated_role);
    
            expect(parse.user.roles).to.have.length(6);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.MODERATOR);
            expect(parse.user.roles).to.include(Roles.STAFF);
            expect(parse.user.roles).to.include(Roles.EDITOR);
            expect(parse.user.roles).to.include(Roles.SUBSCRIBER);
    
            expect(parse.user.primaryRole).to.equal(Roles.OWNER);
        });
    
        it('handles a user being streamjar', () => {
            const parse = mixer.parseMessage(jar_roles);
    
            expect(parse.user.roles).to.have.length(2);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.DEVELOPER);
    
            expect(parse.user.primaryRole).to.equal(Roles.DEVELOPER);
        });
    
        it('handles a user being a bot', () => {
            const parse = mixer.parseMessage(bot_roles);
    
            expect(parse.user.roles).to.have.length(2);
            expect(parse.user.roles).to.include(Roles.USER);
            expect(parse.user.roles).to.include(Roles.BOT);
    
            expect(parse.user.primaryRole).to.equal(Roles.BOT);
        });

        it('detects a command being a command', () => {
            const parse = mixer.parseMessage(command);

            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('Luke');
        });

        it('detects a command being a command via tag', () => {
            const parse = mixer.parseMessage(tag, 'StreamJar');
            
            expect(parse.metadata.command).to.equal(true);
            expect(parse.metadata.commandName).to.equal('give');
            expect(parse.metadata.description).to.equal('Luke');
        });
    });

    describe('join', () => {
        it('parses join events', () => {
            const parse = mixer.parseJoin(user_join);
    
            expect(parse.primaryRole).to.equal(Roles.MODERATOR);
            expect(parse.roles).to.have.length(2);
            expect(parse.roles).to.include(Roles.MODERATOR);
            expect(parse.roles).to.include(Roles.USER);
            expect(parse.userId).to.equal(`${user_join.id}`);
            expect(parse.username).to.equal(user_join.username);
        });
    
        it('handles a user being streamjar', () => {
            const parse = mixer.parseJoin(user_join_jar);
    
            expect(parse.primaryRole).to.equal(Roles.DEVELOPER);
            expect(parse.roles).to.have.length(2);
            expect(parse.roles).to.include(Roles.DEVELOPER);
            expect(parse.roles).to.include(Roles.USER);
        });

        it('handles a user being a bot', () => {
            const parse = mixer.parseJoin(user_join_bot);
    
            expect(parse.primaryRole).to.equal(Roles.BOT);
            expect(parse.roles).to.have.length(2);
            expect(parse.roles).to.include(Roles.BOT);
            expect(parse.roles).to.include(Roles.USER);
        });
    });
});