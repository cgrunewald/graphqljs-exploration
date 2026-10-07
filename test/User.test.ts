/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import * as assert from 'assert';
import {describe, it} from 'node:test';
import User, {MAX_USER_NAME_LENGTH} from '../src/entity/User';

describe('User.validateName', () => {
    it('trims surrounding whitespace', () => {
        assert.strictEqual(User.validateName('  Ada  '), 'Ada');
    });

    it('rejects empty and whitespace-only names', () => {
        assert.throws(() => User.validateName(''), /must not be empty/);
        assert.throws(() => User.validateName('   '), /must not be empty/);
    });

    it('enforces the maximum length after trimming', () => {
        const max = 'x'.repeat(MAX_USER_NAME_LENGTH);
        assert.strictEqual(User.validateName(` ${max} `), max);
        assert.throws(
            () => User.validateName(max + 'x'),
            new RegExp(`at most ${MAX_USER_NAME_LENGTH} characters`),
        );
    });
});

describe('User store', () => {
    it('loads the seeded viewer', async () => {
        const viewer = await User.genEnforce('4');
        assert.strictEqual(viewer.getID(), '4');
        assert.strictEqual(viewer.getName(), 'Calvin');
    });

    it('returns null / throws for unknown users', async () => {
        assert.strictEqual(await User.genNullable('does-not-exist'), null);
        await assert.rejects(User.genEnforce('does-not-exist'), /User does-not-exist not found/);
    });

    it('creates users with fresh IDs and trimmed names', async () => {
        const a = await User.genCreate('  Ada ');
        const b = await User.genCreate('Bob');
        assert.strictEqual(a.getName(), 'Ada');
        assert.notStrictEqual(a.getID(), b.getID());
        const loaded = await User.genEnforce(a.getID());
        assert.strictEqual(loaded.getName(), 'Ada');
    });

    it('renames existing users and rejects unknown IDs', async () => {
        const u = await User.genCreate('Before');
        const renamed = await User.genUpdateName(u.getID(), ' After ');
        assert.strictEqual(renamed.getName(), 'After');
        assert.strictEqual((await User.genEnforce(u.getID())).getName(), 'After');
        await assert.rejects(User.genUpdateName('nope', 'X'), /User nope not found/);
    });

    it('does not let callers mutate stored data through returned entities', async () => {
        const u = await User.genCreate('Stable');
        await User.genUpdateName(u.getID(), 'Changed');
        assert.strictEqual(u.getName(), 'Stable');
    });
});
