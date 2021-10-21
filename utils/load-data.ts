import { Data, Service } from '../interfaces';

const loadData = (): Data => {
  const data: Data = require('../data.json');

  const servicesWithSlugs = data.services.map((service: Service) => {
    return {
      ...service,
      slug: encodeURIComponent(service.name.toLowerCase()),
      slotsLeft: service.slotsMax - service.slotsUsed,
      isSlotsLeft: service.slotsMax - service.slotsUsed > 0,
    };
  });

  const sortedServices = servicesWithSlugs.sort((a, b) => {
    if (a.isSlotsLeft && !b.isSlotsLeft) return -1;
    if (!a.isSlotsLeft && b.isSlotsLeft) return 1;
    return a.name.localeCompare(b.name);
  });

  return { ...data, services: sortedServices };
};

export default loadData;
