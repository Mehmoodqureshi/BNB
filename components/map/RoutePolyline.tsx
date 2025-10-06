'use client';

import React from 'react';
import { Polyline } from '@react-google-maps/api';

interface RoutePolylineProps {
  path: google.maps.LatLng[] | google.maps.LatLngLiteral[];
  options?: google.maps.PolylineOptions;
}

const RoutePolyline: React.FC<RoutePolylineProps> = ({ path, options }) => {
  const defaultOptions: google.maps.PolylineOptions = {
    strokeColor: '#006699',
    strokeOpacity: 0.8,
    strokeWeight: 4,
    geodesic: true,
    ...options
  };

  return <Polyline path={path} options={defaultOptions} />;
};

export default RoutePolyline;
