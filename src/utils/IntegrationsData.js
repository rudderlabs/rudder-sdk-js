import * as R from 'ramda';
import logger from "./logUtil";
import {mergeDeepRight} from "./ObjectUtils";

/**
 * Prepares the data for integrationsObj
 *
 * @param {*} integrationsData
 * @param {*} integrationInstances
 *
 */
const constructMessageIntegrationsObj = (integrationsData, integrationInstances) => {
    let enhancedIntegrationsData = R.clone(integrationsData);

    integrationInstances.forEach((integrationInstance) => {
        if (integrationInstance.getDataForIntegrationsObject) {
            try {
                enhancedIntegrationsData = mergeDeepRight(
                    enhancedIntegrationsData,
                    integrationInstance.getDataForIntegrationsObject()
                );
            } catch (error) {
                logger.debug('[Analytics: prepareDataForIntegrationsObj]', error);
            }
        }
    });

    return enhancedIntegrationsData;
};

/**
 * Prepares the data for integrationsObj
 *
 * @param {*} integrationsData
 * @param {*} clientSuppliedIntegrations
 *
 */
const getMergedClientSuppliedIntegrations = (integrationsData, clientSuppliedIntegrations) => {
    const clonedIntegrationsData = R.clone(integrationsData);

    // Filtering the integrations which are not a part of integrationsData object or value set to false
    const activeClientSuppliedIntegrations = Object.keys(clientSuppliedIntegrations)
        .filter((integration) => !(
            clientSuppliedIntegrations[integration] === true && clonedIntegrationsData[integration]
        ))
        .reduce((obj, key) => {
            // eslint-disable-next-line no-param-reassign
            obj[key] = clientSuppliedIntegrations[key];
            return obj;
        }, {});

    return mergeDeepRight(
        clonedIntegrationsData,
        activeClientSuppliedIntegrations,
    );
};

export {
    constructMessageIntegrationsObj,
    getMergedClientSuppliedIntegrations
}