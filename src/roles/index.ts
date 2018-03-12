import { Role } from "./Role";

export { Role } from './Role';

export const Roles = {
    // StreamJar Admins
    DEVELOPER: new Role('Developer', 100),

    // Channel Staff
    OWNER: new Role('Owner', 50),
    STAFF: new Role('Staff', 45),
    
    // Channel Moderators
    EDITOR: new Role('Editor', 40),
    MODERATOR: new Role('Editor', 35),

    // Channel Users
    REGULAR: new Role('Regular', 20),
    SUBSCRIBER: new Role('Regular', 10),
    FOLLOWER: new Role('Regular', 10),

    // Normal users
    BOT: new Role('Bot', 1),
    USER: new Role('User', 0),
}