// Tests the incident-link allowlist: only https on wildfiresituation.nrs.gov.bc.ca survives.
import { describe, expect, it } from 'vitest';

import { parseIncidentUrl } from './parse-incident-url';

const VALID =
  'https://wildfiresituation.nrs.gov.bc.ca/incidents?fireYear=2026&incidentNumber=V10742';

describe('parseIncidentUrl', () => {
  it('keeps a BCWS incident link', () => {
    expect(parseIncidentUrl(VALID)).toBe(VALID);
  });

  it('drops other hosts, look-alike hosts, http and javascript URLs', () => {
    expect(parseIncidentUrl('https://evil.example/incidents')).toBeNull();
    expect(parseIncidentUrl('https://wildfiresituation.nrs.gov.bc.ca.evil.example/')).toBeNull();
    expect(parseIncidentUrl('http://wildfiresituation.nrs.gov.bc.ca/incidents')).toBeNull();
    expect(parseIncidentUrl('javascript:alert(1)')).toBeNull();
    expect(parseIncidentUrl('https://user:pw@wildfiresituation.nrs.gov.bc.ca/')).toBeNull();
  });

  it('drops empty and unparseable values', () => {
    expect(parseIncidentUrl(null)).toBeNull();
    expect(parseIncidentUrl(undefined)).toBeNull();
    expect(parseIncidentUrl('   ')).toBeNull();
    expect(parseIncidentUrl('not a url')).toBeNull();
  });
});
