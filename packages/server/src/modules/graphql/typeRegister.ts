import { GraphQLObjectType } from 'graphql';

import { fromGlobalId, nodeDefinitions } from 'graphql-relay';

import { GraphQLContext } from './types';

// eslint-disable-next-line no-unused-vars
type Load = (context: GraphQLContext, id: string) => any
type TypeLoaders = {
  [key: string]: {
    type: GraphQLObjectType
    load: Load
  }
}

const getTypeRegister = () => {
  const typesLoaders: TypeLoaders = {};

  const getTypesLoaders = () => typesLoaders;

  const registerTypeLoader = (type: GraphQLObjectType, load: Load) => {
    typesLoaders[type.name] = {
      type,
      load
    };

    return type;
  };

  const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
    (globalId, context: GraphQLContext) => {
      const { type, id } = fromGlobalId(globalId);

      const { load } = typesLoaders[type] || { load: null };

      return (load && load(context, id)) || null;
    },
    // TODO: improve
    (obj): any => {
      const { type } = typesLoaders[obj.constructor.name] || { type: null };

      return type;
    }
  );

  return {
    registerTypeLoader,
    getTypesLoaders,
    nodeField,
    nodesField,
    nodeInterface
  };
};

const { registerTypeLoader, nodeInterface, nodeField, nodesField } = getTypeRegister();

export { registerTypeLoader, nodeInterface, nodeField, nodesField };
