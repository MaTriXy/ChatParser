import { Role } from "./Role";

export { Role } from './Role';

export const Roles: { DEVELOPER: Role, OWNER: Role, STAFF: Role, EDITOR: Role, MODERATOR: Role, REGULAR: Role, SUBSCRIBER: Role, FOLLOWER: Role, BOT: Role, USER: Role } = {
    // StreamJar Admins
    DEVELOPER: new Role('Developer', 100),

    // Channel Staff
    OWNER: new Role('Owner', 50),
    STAFF: new Role('Staff', 45),
    
    // Channel Moderators
    EDITOR: new Role('Editor', 40),
    MODERATOR: new Role('Moderator', 35),

    // Channel Users
    REGULAR: new Role('Regular', 20),
    SUBSCRIBER: new Role('Subscriber', 10),
    FOLLOWER: new Role('Follower', 10),

    // Normal users
    BOT: new Role('Bot', 1),
    USER: new Role('User', 0),
}

export function fromRoles(roles: { role: string, level: number}[]): Role[] {
    return roles.map(role => fromRole(role));
}

export function fromRole(role: { role: string, level: number}): Role {
    const current: Role = Object.keys(Roles).map((name: string) => Roles[name]).find((nRole: Role) => nRole.level === role.level);

    if (current) {
        return current;
    }

    return new Role(role.role, role.level);
}
