import { EntityCtor, EntityManager, EntityRepository, Mapping, Populate, Scope, Wetland } from 'wetland';
import { WetlandConfigType } from '../WetlandConfigType';
import { createDebugLogger } from 'stix';

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
}
