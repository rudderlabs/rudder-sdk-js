/**
 * A function to filter enabled destinations and map to required properties only
 * @param destinations
 *
 * @returns Destination[]
 */
const filterEnabledDestination = destinations => {
  const nativeDestinations = [];
  destinations.forEach(destination => {
    if (destination.enabled && !destination.deleted) {
      nativeDestinations.push({
        id: destination.id,
        displayName: destination.destinationDefinition.displayName,
        config: destination.config,
        shouldApplyDeviceModeTransformation:
          destination.shouldApplyDeviceModeTransformation || false,
        propagateEventsUntransformedOnError:
          destination.propagateEventsUntransformedOnError || false,
        userFriendlyId: `${destination.destinationDefinition.displayName.replaceAll(' ', '-')}___${
          destination.id
        }`,
      });
    }
  });
  return nativeDestinations;
};
export { filterEnabledDestination };
