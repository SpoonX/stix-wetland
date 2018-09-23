import { Config, ServiceManager } from 'stix';
import { WetlandConfigType } from '../WetlandConfigType';
import { WetlandService } from './WetlandService';

export const WetlandServiceFactory = (sm: ServiceManager) => {
  return new WetlandService(sm.get(Config).of<WetlandConfigType>('wetland'));
};
