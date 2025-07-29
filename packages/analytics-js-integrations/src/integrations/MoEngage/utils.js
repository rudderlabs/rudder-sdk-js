export function calculateMoeDataCenter(region) {
  // Calculate the MoEngage data center based on the region
  switch (region) {
    case 'EU':
      return 'dc_2';
    case 'IN':
      return 'dc_3';
    default:
      return 'dc_1'; // Default to US data center
  }
}
