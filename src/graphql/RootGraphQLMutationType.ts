/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
} from "graphql/type";
import UserGraphQLType from "./types/UserGraphQLType";
import User from "../entity/User";

export default new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createUser: {
            type: new GraphQLNonNull(UserGraphQLType),
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "The new user's name (1-64 characters after trimming)",
                },
            },
            resolve: async (source, args: {name: string}) => {
                return await User.genCreate(args.name);
            },
            description: "Creates a new user",
        },
        updateUserName: {
            type: new GraphQLNonNull(UserGraphQLType),
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: "The ID of the user to update",
                },
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "The user's new name (1-64 characters after trimming)",
                },
            },
            resolve: async (source, args: {id: string, name: string}) => {
                return await User.genUpdateName(args.id, args.name);
            },
            description: "Renames an existing user",
        },
    }
});
