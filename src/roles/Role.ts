export class Role {
    constructor(private role: string, public readonly level: number) {}

    public getName() {
        return this.role;
    }

    public hasPermission(questionedRole: Role): boolean {
        return (questionedRole.level >= this.level);
    }
}