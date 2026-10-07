/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import * as assert from 'assert';
import {describe, it} from 'node:test';
import {graphql} from 'graphql';
import schema from '../src/graphql/Schema';

async function run(source: string, variableValues?: {[key: string]: any}) {
    return await graphql({schema, source, variableValues});
}

describe('RootQuery', () => {
    it('resolves the viewer with apps', async () => {
        const result = await run('{ viewer { id name apps { id name } } }');
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(result.data)), {
            viewer: {id: '4', name: 'Calvin', apps: [{id: '1', name: 'foo'}]},
        });
    });

    it('returns null for an unknown user', async () => {
        const result = await run('query($id: ID!) { user(id: $id) { id } }', {id: 'missing'});
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(result.data)), {user: null});
    });
});

describe('RootMutation', () => {
    it('creates a user and reads it back', async () => {
        const created = await run(
            'mutation($name: String!) { createUser(name: $name) { id name } }',
            {name: '  Grace  '},
        );
        assert.strictEqual(created.errors, undefined);
        const user = (created.data as any).createUser;
        assert.strictEqual(user.name, 'Grace');

        const fetched = await run('query($id: ID!) { user(id: $id) { name } }', {id: user.id});
        assert.strictEqual((fetched.data as any).user.name, 'Grace');
    });

    it('renames a user', async () => {
        const created = await run('mutation { createUser(name: "Old") { id } }');
        const id = (created.data as any).createUser.id;
        const renamed = await run(
            'mutation($id: ID!, $name: String!) { updateUserName(id: $id, name: $name) { id name } }',
            {id, name: 'New'},
        );
        assert.strictEqual(renamed.errors, undefined);
        assert.deepStrictEqual(JSON.parse(JSON.stringify(renamed.data)), {
            updateUserName: {id, name: 'New'},
        });
    });

    it('surfaces validation errors', async () => {
        const result = await run('mutation { createUser(name: "   ") { id } }');
        assert.ok(result.errors);
        assert.strictEqual(result.errors![0].message, 'User name must not be empty.');
        assert.strictEqual(result.data, null);
    });

    it('errors when renaming an unknown user', async () => {
        const result = await run('mutation { updateUserName(id: "missing", name: "X") { id } }');
        assert.ok(result.errors);
        assert.strictEqual(result.errors![0].message, 'User missing not found.');
    });
});
