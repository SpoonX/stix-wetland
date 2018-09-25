import * as config from '../config';
import { ConfigType, Event, ModuleInterface, ModuleManager, ServerService } from 'stix';
import { WetlandService } from './Service';
import { wetlandQueryParserMiddleware } from '../middleware';

export class Wetland implements ModuleInterface {
  public async onBootstrap (event: Event<ModuleManager>): Promise<void> {
    const serviceManager = event.getTarget().getApplication().getServiceManager();

    serviceManager.get(ServerService).useAfter('router', wetlandQueryParserMiddleware);

    await serviceManager.get(WetlandService).devMigrations();
  }

  public getConfig (): ConfigType {
    return config;
  }
}
