import React from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false
});

const StatBox9 = () => {
  const markers = [
    { position: [48.8566, 2.3522], popupContent: 'Marker 1: Paris, France', iconUrl: '/assets/MainDash/locationGreen.svg' }, 
    { position: [40.7128, -74.0060], popupContent: 'Marker 2: New York, USA', iconUrl: '/assets/MainDash/locationRed.svg' }, 
    { position: [35.6895, 139.6917], popupContent: 'Marker 3: Tokyo, Japan', iconUrl: '/assets/MainDash/locationGreen.svg' },
    { position: [-33.8688, 151.2093], popupContent: 'Marker 4: Sydney, Australia', iconUrl: '/assets/MainDash/locationGreen.svg' },
    { position: [55.7558, 37.6176], popupContent: 'Marker 5: Moscow, Russia', iconUrl: '/assets/MainDash/locationRed.svg' },
    { position: [40.4168, -3.7038], popupContent: 'Marker 6: Madrid, Spain', iconUrl: '/assets/MainDash/locationGreen.svg' },
    { position: [39.9042, 116.4074], popupContent: 'Marker 7: Beijing, China', iconUrl: '/assets/MainDash/locationRed.svg' },
    { position: [51.5074, -0.1278], popupContent: 'Marker 8: London, UK', iconUrl: '/assets/MainDash/locationRed.svg' },
    { position: [37.7749, -122.4194], popupContent: 'Marker 9: San Francisco, USA', iconUrl: '/assets/MainDash/locationRed.svg' },
    { position: [1.3521, 103.8198], popupContent: 'Marker 10: Singapore', iconUrl: '/assets/MainDash/locationGreen.svg' },
    { position: [-1.2864, 36.8172], popupContent: 'Marker 11: Nairobi, Kenya', iconUrl: '/assets/MainDash/locationRed.svg' }, 
    { position: [-34.0337, 18.4627], popupContent: 'Marker 12: Cape Town, South Africa', iconUrl: '/assets/MainDash/locationGreen.svg' }, 
    { position: [5.6037, -0.1870], popupContent: 'Marker 13: Accra, Ghana', iconUrl: '/assets/MainDash/locationRed.svg' }, 
    { position: [9.0820, 8.6753], popupContent: 'Marker 14: Abuja, Nigeria', iconUrl: '/assets/MainDash/locationGreen.svg' },
  ];

  return (
    <>
      <LeafletMap markers={markers} />
    </>
  );
};

export default StatBox9;
