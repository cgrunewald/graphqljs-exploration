/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import Entity from './core/Entity';

interface UserData {
    name: string,
}

export default class User extends Entity<UserData> {
    getName(): string {
        return this._getField("name");
    }

    static async genNullable(id: string): Promise<User | null> {
        return new User('4', {name: 'Calvin'});
    }

    static async genEnforce(id: string): Promise<User> {
        const a = User.genNullable(id);
        if (a == null) {
            throw new Error('null');
        }
        return a;
    }
}