import { EntityCtor, EntityInterface } from 'wetland';
import { Clients } from './Clients';

export type WetlandConfigType = Partial<{
  devMigrations?: boolean;
  entityPath?: string;
  entityPaths?: string[];
  entities: EntityCtor<EntityInterface>[];
  debug         : boolean;
  useForeignKeys: boolean;
  dataDirectory : string;
  defaultStore  : string;
  mapping       : {
    defaultNamesToUnderscore: boolean;
    defaults                : {cascades: string[]};
  };
  entityManager : {
    refreshCreated: boolean;
    refreshUpdated: boolean;
  };
  stores?: {
    [key: string]: StoreType;
  };
}>;

export type StoreType = {
  client: Clients;
  connection: {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
  };
};
