export const processFeatures = (properties: any[]) => {
  return properties.map(property => ({
    type: 'Feature',
    properties: {
      id: property.id,
      title: property.title,
      price: property.rent || property.price,
      currency: property.currency || 'AED',
      rating: property.rating,
      reviewCount: property.reviewCount,
      agency_id: property.agency_id,
      ...property
    },
    geometry: {
      type: 'Point',
      coordinates: [property.lng || property.longitude, property.lat || property.latitude]
    }
  }));
};

export const formatPrice = (price: number, currency: string = 'AED') => {
  return `${currency} ${price.toLocaleString()}`;
};

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180);
};
