/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from "graphql/type";
import UserGraphQLType from "./types/UserGraphQLType";
import User from "../entity/User";
import {
    ConnectionArgs,
    connectionArgs,
    connectionFromEntities,
    createConnectionType,
} from "./connection/Connection";

const UserConnectionGraphQLType = createConnectionType('User', UserGraphQLType);

export default new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
       viewer: {
            type: UserGraphQLType,
            resolve: async (source, args, context) => {
                console.log(arguments);
                return await User.genNullable('4');
            },
            description: "The current viewer",
       },
       user: {
            type: UserGraphQLType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (source, args: {id: string}) => {
                return await User.genNullable(args.id);
            },
            description: "Look up a user by ID",
       },
       users: {
            type: new GraphQLNonNull(UserConnectionGraphQLType),
            args: connectionArgs,
            resolve: async (source, args: ConnectionArgs) => {
                return connectionFromEntities(await User.genAll(), args);
            },
            description: "All users, ordered by ID, with Relay cursor pagination",
       },
    }
});