const getTraitsToSetOnce = (config) => {
  const traitsToSetOnce = [];
  if (config.traitsToSetOnce && config.traitsToSetOnce.length > 0) {
    config.traitsToSetOnce.forEach((element) => {
      if (element?.traits && element.traits !== '') {
        traitsToSetOnce.push(element.traits);
      }
    });
  }
  return traitsToSetOnce;
};

const getTraitsToIncrement = (config) => {
  const traitsToIncrement = [];
  if (config.traitsToIncrement && config.traitsToIncrement.length > 0) {
    config.traitsToIncrement.forEach((element) => {
      if (element?.traits && element.traits !== '') {
        traitsToIncrement.push(element.traits);
      }
    });
  }
  return traitsToIncrement;
};

export { getTraitsToSetOnce, getTraitsToIncrement };
