export class Role {
    constructor(public readonly role: string, public readonly level: number) {}

    public getName(): string {
        return this.role;
    }

    public hasPermission(questionedRole: Role): boolean {
        return (questionedRole.level >= this.level);
    }
}