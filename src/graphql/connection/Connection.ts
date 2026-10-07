/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from 'graphql/type';
import Entity from '../../entity/core/Entity';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

const CURSOR_PREFIX = 'cursor:';

export interface ConnectionArgs {
    first?: number | null,
    after?: string | null,
}

export interface PageInfo {
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    startCursor: string | null,
    endCursor: string | null,
}

export interface Edge<T> {
    cursor: string,
    node: T,
}

export interface Connection<T> {
    edges: Edge<T>[],
    pageInfo: PageInfo,
    totalCount: number,
}

export function encodeCursor(id: string): string {
    return Buffer.from(CURSOR_PREFIX + id, 'utf8').toString('base64');
}

export function decodeCursor(cursor: string): string {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    if (!decoded.startsWith(CURSOR_PREFIX)) {
        throw new Error(`Invalid cursor: ${cursor}`);
    }
    return decoded.slice(CURSOR_PREFIX.length);
}

/**
 * Builds a forward-paginated Relay connection over an already-ordered list of
 * entities. Cursors are opaque base64 encodings of the entity ID.
 */
export function connectionFromEntities<T extends Entity<any>>(
    entities: T[],
    args: ConnectionArgs,
): Connection<T> {
    const first = args.first == null ? DEFAULT_PAGE_SIZE : args.first;
    if (first < 0 || first > MAX_PAGE_SIZE) {
        throw new Error(`Argument "first" must be between 0 and ${MAX_PAGE_SIZE}.`);
    }

    let start = 0;
    if (args.after != null) {
        const afterID = decodeCursor(args.after);
        const index = entities.findIndex(e => e.getID() === afterID);
        if (index === -1) {
            throw new Error(`Cursor ${args.after} does not match any item.`);
        }
        start = index + 1;
    }

    const slice = entities.slice(start, start + first);
    const edges = slice.map(node => ({cursor: encodeCursor(node.getID()), node}));
    return {
        edges,
        pageInfo: {
            hasNextPage: start + first < entities.length,
            hasPreviousPage: start > 0,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
        totalCount: entities.length,
    };
}

export const PageInfoGraphQLType = new GraphQLObjectType({
    name: 'PageInfo',
    description: 'Relay pagination information',
    fields: {
        hasNextPage: {type: new GraphQLNonNull(GraphQLBoolean)},
        hasPreviousPage: {type: new GraphQLNonNull(GraphQLBoolean)},
        startCursor: {type: GraphQLString},
        endCursor: {type: GraphQLString},
    },
});

export const connectionArgs = {
    first: {
        type: GraphQLInt,
        description: `Number of items to return (0-${MAX_PAGE_SIZE}, default ${DEFAULT_PAGE_SIZE})`,
    },
    after: {
        type: GraphQLString,
        description: 'Return items after this cursor',
    },
};

/**
 * Creates `<Name>Edge` and `<Name>Connection` GraphQL types for a node type.
 */
export function createConnectionType(
    name: string,
    nodeType: GraphQLObjectType,
): GraphQLObjectType {
    const edgeType = new GraphQLObjectType({
        name: `${name}Edge`,
        description: `An edge in a ${name} connection`,
        fields: {
            cursor: {type: new GraphQLNonNull(GraphQLString)},
            node: {type: nodeType},
        },
    });
    return new GraphQLObjectType({
        name: `${name}Connection`,
        description: `A Relay connection of ${name} nodes`,
        fields: {
            edges: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(edgeType)))},
            pageInfo: {type: new GraphQLNonNull(PageInfoGraphQLType)},
            totalCount: {type: new GraphQLNonNull(GraphQLInt)},
        },
    });
}
