/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import Entity from './core/Entity';

interface UserData {
    name: string,
}

export const MAX_USER_NAME_LENGTH = 64;

/**
 * Simple in-memory backing store for users. Seeded with the default viewer.
 */
const userStore: Map<string, UserData> = new Map([
    ['4', {name: 'Calvin'}],
]);
let nextUserID = 5;

export default class User extends Entity<UserData> {
    getName(): string {
        return this._getField("name");
    }

    /**
     * Trims and validates a user name. Throws a descriptive error if invalid.
     */
    static validateName(name: string): string {
        const trimmed = name.trim();
        if (trimmed.length === 0) {
            throw new Error('User name must not be empty.');
        }
        if (trimmed.length > MAX_USER_NAME_LENGTH) {
            throw new Error(
                `User name must be at most ${MAX_USER_NAME_LENGTH} characters.`,
            );
        }
        return trimmed;
    }

    static async genNullable(id: string): Promise<User | null> {
        const data = userStore.get(id);
        return data == null ? null : new User(id, {...data});
    }

    static async genEnforce(id: string): Promise<User> {
        const a = await User.genNullable(id);
        if (a == null) {
            throw new Error(`User ${id} not found.`);
        }
        return a;
    }

    static async genCreate(name: string): Promise<User> {
        const data = {name: User.validateName(name)};
        const id = String(nextUserID++);
        userStore.set(id, data);
        return new User(id, {...data});
    }

    static async genUpdateName(id: string, name: string): Promise<User> {
        const validName = User.validateName(name);
        const data = userStore.get(id);
        if (data == null) {
            throw new Error(`User ${id} not found.`);
        }
        data.name = validName;
        return new User(id, {...data});
    }
}
