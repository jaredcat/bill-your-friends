import { Data } from '../interfaces';

const loadData = (): Data => {
  const data: Data = require('../data.json');

  const servicesWithSlugs = data.services.map((service) => {
    return {
      ...service,
      slug: encodeURIComponent(service.name.toLowerCase()),
    };
  });

  return { ...data, services: servicesWithSlugs };
};

export default loadData;
