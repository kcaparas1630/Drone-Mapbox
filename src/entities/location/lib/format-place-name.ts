// Turns a reverse geocode answer into the readout text, e.g. "Near Millar, Prince George" (behaviour §4.1).
import type { ReverseGeocodeResponse } from '../model/reverse-geocode.schema';

type PlaceProperties = ReverseGeocodeResponse['features'][number]['properties'];

// Returns the first feature of the given types, in the order the types are listed.
function findFeature(
  features: readonly PlaceProperties[],
  featureTypes: readonly string[],
): PlaceProperties | undefined {
  for (const featureType of featureTypes) {
    const feature = features.find((candidate) => candidate.feature_type === featureType);
    if (feature !== undefined) {
      return feature;
    }
  }
  return undefined;
}

// Returns "Near {area}, {town}", "Near {town}, {province}", "Over {district}, {province}" or "Over {province}".
export function formatPlaceName(response: ReverseGeocodeResponse): string | null {
  const features = response.features.map((feature) => feature.properties);
  const area = findFeature(features, ['neighborhood', 'locality']);
  const town = findFeature(features, ['place']);
  const district = findFeature(features, ['district']);
  const regionName =
    findFeature(features, ['region'])?.name ??
    (town ?? district ?? area)?.context?.region?.name ??
    null;
  if (town !== undefined) {
    const suffix = area === undefined ? regionName : town.name;
    const lead = area === undefined ? town.name : area.name;
    return suffix === null ? `Near ${lead}` : `Near ${lead}, ${suffix}`;
  }
  if (area !== undefined || district !== undefined) {
    const name = (district ?? area)?.name ?? '';
    return regionName === null ? `Over ${name}` : `Over ${name}, ${regionName}`;
  }
  return regionName === null ? null : `Over ${regionName}`;
}
