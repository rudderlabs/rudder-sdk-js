import { readdirSync } from 'fs';
import { join } from 'path';
import { destDisplayNamesToPinSupportMap } from '../../src/utilities/destDisplayNamesToPinSupportMap';

type PinDeclaration = {
  DISPLAY_NAME: string;
  VENDOR_SDK_PIN_SUPPORT?: string;
};

const expectMapParity = (
  declarations: PinDeclaration[],
  supportMap: Record<string, string | undefined>,
) => {
  const supportedDeclarations = declarations.filter(
    declaration =>
      declaration.VENDOR_SDK_PIN_SUPPORT === 'full' ||
      declaration.VENDOR_SDK_PIN_SUPPORT === 'no-script',
  );
  expect(supportMap).toEqual(
    Object.fromEntries(
      supportedDeclarations.map(({ DISPLAY_NAME, VENDOR_SDK_PIN_SUPPORT }) => [
        DISPLAY_NAME,
        VENDOR_SDK_PIN_SUPPORT,
      ]),
    ),
  );
};

test('support map matches every integration constants declaration', async () => {
  const integrationsDir = join(__dirname, '../../../analytics-js-integrations/src/integrations');
  const declarations = await Promise.all(
    readdirSync(integrationsDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => import(join(integrationsDir, entry.name, 'constants'))),
  );
  expectMapParity(declarations, destDisplayNamesToPinSupportMap);
});

test.each([
  ['missing full registration', { 'Script Vendor': 'full' }, {}],
  ['missing no-script registration', { 'Script Vendor': 'no-script' }, {}],
  ['mismatched support', { 'Script Vendor': 'full' }, { 'Script Vendor': 'no-script' }],
  ['unsupported declaration', { 'Script Vendor': 'none' }, { 'Script Vendor': 'full' }],
  ['undeclared support', { 'Script Vendor': undefined }, { 'Script Vendor': 'full' }],
  ['unknown display name', {}, { 'Unknown Vendor': 'no-script' }],
])('parity rejects %s', (_scenario, declarations, supportMap) => {
  expect(() =>
    expectMapParity(
      Object.entries(declarations).map(([DISPLAY_NAME, VENDOR_SDK_PIN_SUPPORT]) => ({
        DISPLAY_NAME,
        VENDOR_SDK_PIN_SUPPORT,
      })),
      supportMap,
    ),
  ).toThrow();
});
