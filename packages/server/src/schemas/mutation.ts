import { GraphQLObjectType } from 'graphql';

import * as userMutations from '../modules/user/mutations';
import * as postMutations from '../modules/post/mutations';

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root mutation',
  fields: () => ({
    ...userMutations,
    ...postMutations,
  }),
});
