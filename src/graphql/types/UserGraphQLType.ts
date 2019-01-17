/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import User from '../../entity/User';
import EntityGraphQLType from './EntityGraphQLType';
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} from 'graphql/type';
import AppGraphQLType from './AppGraphQLType';
import App from '../../entity/App';

export default new GraphQLObjectType({
  name: 'User',
  interfaces: [EntityGraphQLType],
  isTypeOf: (value: any) => {
      return value instanceof User;
  },
  description: "A user",
  fields: {
    id: { 
        type: GraphQLID,
        resolve: async (source: User) => {
            return source.getID();
        },
        description: `
            The user's ID.
        `,
    },
    name: { 
        type: GraphQLString,
        resolve: async (source: User) => {
            return source.getName();
        },
        description: `
            The user's name.
        `,
    },
    apps: {
        type: new GraphQLList(AppGraphQLType),
        resolve: async (source: User) => {
            const app = await App.genEnforce('1');
            return [app];
        },
        description: "User's apps",
    }
  }
});
