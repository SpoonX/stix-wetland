import { ServiceManagerConfigType } from 'stix';
import { WetlandService, WetlandServiceFactory } from '../Library/Service';

export const services: ServiceManagerConfigType = {
  factories: new Map([
    [ WetlandService, WetlandServiceFactory ],
  ]),
};
