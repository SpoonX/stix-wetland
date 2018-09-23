import * as config from '../config';
import { ConfigType, Event, ModuleInterface, ModuleManager } from 'stix';
import { WetlandService } from './Service';

export class Wetland implements ModuleInterface {
  public async onBootstrap (event: Event<ModuleManager>): Promise<void> {
    const serviceManager = event.getTarget().getApplication().getServiceManager();

    await serviceManager.get(WetlandService).devMigrations();
  }

  public getConfig (): ConfigType {
    return config;
  }
}
