import React, { useState, useEffect } from 'react';
import { fetchDevices } from '../../../app/utils/apis/devices'; 
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./leafletMap'), {
  ssr: false
});

const StatBox9 = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await fetchDevices();
        
        console.log('Fetched devices:', devices);
        const markersData = devices.map(device => {
          const coordinates = device.location?.coordinates || [0, 0];
          const status = device.status || 'Unknown'; // Default to 'Unknown' if status is not available

          // Determine the icon URL based on the status
          let iconUrl;
          if (status === 'In use') {
            iconUrl = '/assets/MainDash/locationGreen.svg';
          } else if (status === 'Maintenance') {
            iconUrl = '/assets/MainDash/locationPurple.svg';
          } else if (status === 'Suspended') {
            iconUrl = '/assets/MainDash/locationRed.svg';
          }

          console.log('Device coordinates:', coordinates);
          console.log('Device status:', status);
          console.log('Marker icon URL:', iconUrl);

          return {
            position: coordinates,
            popupContent: `Device ${device.deviceName}`,
            iconUrl: iconUrl
          };
        });

        console.log('Formatted markers data:', markersData);

        setMarkers(markersData);
      } catch (error) {
        console.error('Error loading devices:', error);
      }
    };

    loadDevices();
  }, []);

  return (
    <>
      <LeafletMap markers={markers} />
    </>
  );
};

export default StatBox9;
