import {ErrorReportingService} from '../../../../../src/features/core/metrics/errorReporting/ErrorReportingService';
import logger from '../../../../../src/utils/logUtil';

const errorReportingService = new ErrorReportingService(logger);

describe('Error reporting service Test suite', () => {
    // test('Should print error message if source config or sourceId is not provided in init call', () => {
    //     const outcome = () => errorReportingService.init();
    //     expect(outcome).toThrow(
    //     '[Analytics] ErrorReporting :: Invalid configuration or missing source id provided.',
    //     );
    // });
    // uncomment the below test case once we remove the '|| true' from line 12
    // test('Should not initialize provider if not enabled from source config in init call', () => {
    //     errorReportingService.init({statsCollection:{errorReports:{enabled:false}}}, 'random-source-id');
    //     expect(errorReportingService.isEnabled).toEqual(false);
    // });
    test('Should initialize provider if enabled from source config in init call', () => {
        errorReportingService.init({statsCollection:{errorReports:{enabled:true}}}, 'random-source-id');
        expect(errorReportingService.isEnabled).toEqual(true);
    });
})