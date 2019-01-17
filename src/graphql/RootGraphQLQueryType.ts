/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import { GraphQLObjectType } from "graphql/type";
import UserGraphQLType from "./types/UserGraphQLType";
import User from "../entity/User";

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
    }
});