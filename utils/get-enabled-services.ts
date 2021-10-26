import { Data, Service } from "../interfaces";
import loadData from "./load-data";

const data: Data = loadData();
const { services } = data;

export function getEnabledServices(): Service[] {
  const enabledServices: Service[] = services.filter(
    ({ enabled, tiers }) => enabled && Object.values(tiers).length > 0
  );

  return enabledServices;
}
