// External ID format
// {
//   "context": {
//     "externalId": [
//       {
//         "type": "kustomerId",
//         "id": "12345678"
//       }
//     ]
//   }
// }
// to get destination specific external id passed in context.
function getDestinationExternalID(message, type) {
  let externalIdArray = null;
  let destinationExternalId = null;
  const { context } = message;
  if (context?.externalId) {
    externalIdArray = context.externalId;
  }
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      if (extIdObj.type === type) {
        destinationExternalId = extIdObj.id;
      }
    });
  }
  return destinationExternalId;
}

export { getDestinationExternalID };
