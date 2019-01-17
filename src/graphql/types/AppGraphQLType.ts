/*
 * Copyright (c) 2019 Calvin Grunewald
 */

import App from '../../entity/App';
import EntityGraphQLType from './EntityGraphQLType';
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
} from 'graphql/type';

export default new GraphQLObjectType({
  name: 'App',
  interfaces: [EntityGraphQLType],
  isTypeOf: (value: any) => {
      return value instanceof App;
  },
  description: "An app",
  fields: {
    id: { 
        type: GraphQLID,
        resolve: async (source: App) => {
            return source.getID();
        },
        description: `
            The app's ID.
        `,
    },
    name: { 
        type: GraphQLString,
        resolve: async (source: App) => {
            return source.getName();
        },
        description: `
            The app's name.
        `,
    },
  }
});
