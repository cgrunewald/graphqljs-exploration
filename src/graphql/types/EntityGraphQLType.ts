/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import {
    GraphQLInterfaceType,
    GraphQLString,
    GraphQLID,
} from 'graphql/type';

export default new GraphQLInterfaceType({
  name: 'Entity',
  fields: {
    name: { type: GraphQLString },
    id: { type: GraphQLID }
  }
});