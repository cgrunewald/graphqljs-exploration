/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import { GraphQLSchema } from "graphql";
import RootGraphQLQueryType from "./RootGraphQLQueryType";
import RootGraphQLMutationType from "./RootGraphQLMutationType";

export default new GraphQLSchema({
    query: RootGraphQLQueryType,
    // mutation: RootGraphQLMutationType,
});