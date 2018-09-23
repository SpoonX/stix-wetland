import { EntityCtor, EntityManager, EntityRepository, Scope, Wetland } from 'wetland';
import { WetlandConfigType } from '../WetlandConfigType';

export class WetlandService {
  private readonly wetland: Wetland;

  private readonly config: WetlandConfigType;

  constructor (config: WetlandConfigType) {
    this.config  = config;
    this.wetland = new Wetland(config);
  }

  public async devMigrations (): Promise<this> {
    if (!this.config.devMigrations) {
      return this;
    }

    await this.wetland.getMigrator().devMigrations(false);

    return this;
  }

  public getManager (): Scope {
    return this.wetland.getManager();
  }

  public getEntityManager (): EntityManager {
    return this.wetland.getEntityManager();
  }

  public getRepository<T> (Entity: string | EntityCtor<T>): EntityRepository<T> {
    return this.wetland.getEntityManager().getRepository(Entity);
  }
}
