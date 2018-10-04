import * as config from '../config';
import * as cliConfig from '../config/cli';
import { ConfigType, Event, ModuleInterface, ModuleManager, RouterMiddleware, ServerService } from 'stix';
import { WetlandService } from './Service';
import { wetlandQueryParserMiddleware } from '../middleware';

export class Wetland implements ModuleInterface {
  public async onBootstrap (event: Event<ModuleManager>): Promise<void> {
    const serviceManager = event.getTarget().getApplication().getServiceManager();

    serviceManager.get(ServerService).useAfter(RouterMiddleware, wetlandQueryParserMiddleware);

    await serviceManager.get(WetlandService).devMigrations();
  }

  public getConfig (mode: string): ConfigType {
    return config;
  }

  public getCliConfig (): ConfigType {
    return cliConfig;
  }
}
