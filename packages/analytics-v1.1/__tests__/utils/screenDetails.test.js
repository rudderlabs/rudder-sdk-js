import { getScreenDetails } from '../../src/utils/screenDetails';
import { RudderScreenInfo } from '../../src/utils/RudderInfo';

describe('Screen Details Utilities', () => {
  const expectedScreenInfo = new RudderScreenInfo();
  expectedScreenInfo.density = 1;
  expectedScreenInfo.width = 1680;
  expectedScreenInfo.height = 1024;
  expectedScreenInfo.innerWidth = 1680;
  expectedScreenInfo.innerHeight = 1024;

  it('should get Screen Details when window is defined', () => {
    jest.spyOn(window.screen, 'width', 'get').mockReturnValue(1680);
    jest.spyOn(window.screen, 'height', 'get').mockReturnValue(1024);
    const screen = getScreenDetails();

    expect(screen).toStrictEqual(expectedScreenInfo);
  });
});
