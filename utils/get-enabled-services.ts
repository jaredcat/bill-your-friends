import { Data, Service } from '../interfaces';

const data: Data = require('../data.json');
const { services } = data;

export function getEnabledServices(): { slug: string; name: string }[] {
  const enabledServices: { slug: string; name: string }[] = services.reduce(
    (acc, service: Service) => {
      if (service.enabled && Object.values(service.tiers).length > 0) {
        acc.push({
          slug: encodeURIComponent(service.name.toLowerCase()),
          name: service.name,
        });
      }
      return acc;
    },
    [],
  );

  return enabledServices;
}
