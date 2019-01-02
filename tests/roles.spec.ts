import { expect } from 'chai';
import { Roles } from '../src/roles';


describe('Roles', () => {

    it('allows the user to get the role', () => {
        expect(Roles.DEVELOPER.getName()).to.equal('Developer');
    });

    it('correctly handles role being above current', () => {
        expect(Roles.MODERATOR.hasPermission(Roles.DEVELOPER)).to.equal(true);
    });
    
    it('correctly parses roles with lesser importance', () => {
        expect(Roles.MODERATOR.hasPermission(Roles.USER)).to.equal(false);
    });
    
    it('correctly parses roles with equal importance', () => {
        expect(Roles.MODERATOR.hasPermission(Roles.MODERATOR)).to.equal(true);
    });
});