import { EntityCtor, EntityManager, EntityRepository, Mapping, Populate, Scope, Wetland } from 'wetland';
import { WetlandConfigType } from '../WetlandConfigType';
import { createDebugLogger, ServiceManager } from 'stix';
import { FindOptions } from 'wetland/dist/src/EntityRepository';
import { BodyParamType, IdParamType } from '../../decorators/actions';

const debug = createDebugLogger('wetland');

export class WetlandService {
  private readonly wetland: Wetland;

  private readonly config: WetlandConfigType;

  constructor (config: WetlandConfigType) {
    this.config  = config;
    this.wetland = new Wetland(config);
  }

  public async devMigrations (): Promise<this> {
    if (!this.config.devMigrations) {
      debug('Skipping dev migrations due to falsy value of `devMigrations`.');
      return this;
    }

    debug('Applying dev migrations...');

    await this.wetland.getMigrator().devMigrations(false);

    debug('Dev migrations completed.');

    return this;
  }

  public getInstance (): Wetland {
    return this.wetland;
  }

  public getManager (): Scope {
    return this.wetland.getManager();
  }

  public getEntityManager (): EntityManager {
    return this.wetland.getEntityManager();
  }

  public getPopulator (manager: Scope): Populate {
    return this.wetland.getPopulator(manager);
  }

  public getRepository<T> (Entity: string | EntityCtor<T>): EntityRepository<T> {
    return this.wetland.getEntityManager().getRepository(Entity);
  }

  public getMapping<T> (Entity: T): Mapping<T> {
    return this.getEntityManager().getMapping(Entity);
  }

  public findOne (Entity: EntityCtor<any>, criteria: {} | number | string, options?: FindOptions) {
    return this.getRepository(Entity).findOne(criteria, options);
  }

  public find (Entity: EntityCtor<any>, criteria?: {} | number | string, options?: FindOptions) {
    return this.getRepository(Entity).find(criteria, options);
  }

  public async destroy (Entity: EntityCtor<any>, criteria?: {} | number | string) {
    const manager = this.getManager();
    const result  = await manager.getRepository(Entity).findOne(criteria);

    if (result) {
      await manager.remove(result).flush();
    }

    return result;
  }

  public async create (Entity: EntityCtor<any>, data: object | object[], recursive?: boolean | number) {
    const manager          = await this.getManager();
    const populator        = this.getPopulator(manager);
    const persistedEntries = (() => {
      const persistEntry = (entry: Object) => {
        const newRecord = populator.assign(Entity, entry, null, recursive);

        manager.persist(newRecord);

        return newRecord;
      };

      if (!Array.isArray(data)) {
        return persistEntry(data);
      }

      return data.map(persistEntry);
    })();

    await manager.flush();

    return persistedEntries;
  }

  public async modify (Entity: EntityCtor<any>, pkValue: number | string, data: object | object[], recursive?: boolean | number) {
    const manager   = await this.getManager();
    const pk        = manager.getMapping(Entity).getPrimaryKey();
    const populator = this.getPopulator(manager);
    const safeData  = { ...data, [pk]: pkValue };
    const base      = await populator.findDataForUpdate(pkValue, Entity as any, safeData);

    if (!base) {
      return null;
    }

    // Assign values to fetched base.
    populator.assign(Entity, safeData, base, recursive);

    // Apply changes.
    await manager.flush();

    return base;
  }
}
