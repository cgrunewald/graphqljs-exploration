/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import Entity from './core/Entity';

interface AppData {
    name: string,
}

export default class App extends Entity<AppData> {
    getName(): string {
        return this._getField("name");
    }

    static async genNullable(id: string): Promise<App | null> {
        return new App('1', {name: 'foo'});
    }

    static async genEnforce(id: string): Promise<App> {
        const a = App.genNullable(id);
        if (a == null) {
            throw new Error('null');
        }
        return a;
    }
}