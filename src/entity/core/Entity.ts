/*
 * Copyright (c) 2019 Calvin Grunewald
 */

export default class Entity<T extends Object> {
    private _id: string;
    private _data: T;

    constructor(id: string, data: T) {
        this._id = id;
        this._data = data;
    }

    getID(): string {
        return this._id;
    }

    protected _getField<K extends keyof T>(k: K): T[K] {
        return this._data[k];
    }
}