import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert'; 
import ErrorAlert from '@components/Commun/Alerts/error-alert'; 
import { updateDeviceById } from '@app/utils/apis/devices'; 
import { updateSensorById, fetchSensors } from '@app/utils/apis/sensors';
import { fetchCountries, fetchStates } from '@app/utils/apis/location';
import removeIcon from '/public/assets/Table/delete.svg';
import axios from 'axios';

const EditDevice = ({ isOpen, onClose, initialDeviceData }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [deviceData, setDeviceData] = useState({
    ref: '',
    deviceName: '',
    macAddress: '',
    countryId: '',
    countryName: '',
    state: '',
    adminID: '', 
    clients: [],
    sensors: [],
    status: '',
    latitude: '',
    longitude: '',
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    if (initialDeviceData) {
      console.log('Initial Device Data:', initialDeviceData);
      const { location } = initialDeviceData;
      setDeviceData({
        ...initialDeviceData,
        latitude: location?.coordinates[1] || '', 
        longitude: location?.coordinates[0] || '' 
      });
    } else {
      setDeviceData({
        ref: '',
        deviceName: '',
        macAddress: '',
        countryId: '',
        countryName: '',
        state: '',
        adminID: '',
        sensors: [],
        status: '',
        latitude: '',
        longitude: '',
      });
    }
  
    fetchInitialData();
  }, [isOpen, initialDeviceData]);
  
  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found in localStorage.');
      }
      
      const [countriesData, statesData, sensorsData, adminsData] = await Promise.all([
        fetchCountries(),
        fetchStates(),
        fetchSensors(),
        axios.get('http://localhost:3008/users/role/admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => response.data)
      ]);

      setCountries(countriesData);
      setStates(statesData);
      const unassignedSensors = sensorsData.filter(sensor => !sensor.deviceID);
      setSensors(unassignedSensors);
      setAdmins(adminsData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setAlertMessage('Error fetching initial data');
      setShowErrorAlert(true);
    }
  };

  const handleCloseAlerts = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'countryId') {
      const selectedCountry = countries.find(country => String(country.id) === value);
      setDeviceData({
        ...deviceData,
        countryId: value,
        countryName: selectedCountry ? selectedCountry.name : ''
      });
    } else if (name === 'adminID') {
      setDeviceData({
        ...deviceData,
        adminID: value,
        admin: admins.find(admin => admin._id === value)?.firstName || '' 
      });
    } else {
      setDeviceData({ ...deviceData, [name]: value });
    }
  };

  const validateForm = () => {
    const requiredFields = ['ref', 'deviceName', 'macAddress', 'countryId', 'state', 'adminID', 'sensors', 'status', 'latitude', 'longitude'];
    for (const field of requiredFields) {
      if (!deviceData[field]) {
        setAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }
    return true;
  };

  const updateSensors = async (deviceId) => {
    try {
      const sensors = await fetchSensors();
      await Promise.all(deviceData.sensors.map(async (sensorReference) => {
        const sensor = sensors.find(sensor => sensor.sensorReference === sensorReference);
        if (sensor) {
          await updateSensorById(sensor._id, { deviceID: deviceId });
        }
      }));
    } catch (sensorError) {
      console.error('Error updating sensors:', sensorError);
      throw sensorError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const updatedDeviceData = {
      ...deviceData,
      latitude: parseFloat(deviceData.latitude),
      longitude: parseFloat(deviceData.longitude),
      location: {
        type: 'Point',
        coordinates: [parseFloat(deviceData.longitude), parseFloat(deviceData.latitude)] // Ensure correct order
      }
    };
  
    console.log('Sending data:', updatedDeviceData); // Log data to verify
  
    try {
      const updatedDevice = await updateDeviceById(deviceData._id, updatedDeviceData);
      await updateSensors(updatedDevice._id);
  
      setShowSuccessAlert(true);
      setTimeout(() => {
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating device:', error);
      setAlertMessage('Error updating device');
      setShowErrorAlert(true);
    }
  };
  

  if (!isOpen) {
    return null;
  }
  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Device updated successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
      <div className='flex'>
          <input
            type="text"
            id="ref"
            name="ref"
            className="input-field mr-2"
            placeholder="ID"
            value={deviceData.ref}
            onChange={handleChange}
          />
          <input
            type="text"
            id="deviceName"
            name="deviceName"
            className="input-field"
            placeholder="Device Name"
            value={deviceData.deviceName}
            onChange={handleChange}
          />
         </div> 
        </div>
        <div className="form-group">
          <input
            type="text"
            id="macAddress"
            name="macAddress"
            className="input-field"
            placeholder="Mac Address"
            value={deviceData.macAddress}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <select
            id="countryId"
            name="countryId"
            className="input-field custom-select"
            value={deviceData.countryId}
            onChange={handleChange}
          >
            <option value="" disabled>Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="state"
            name="state"
            className="input-field custom-select"
            value={deviceData.state}
            onChange={handleChange}
          >
            <option value="" disabled>Select State</option>
            {states
              .filter((state) => state.country_id === parseInt(deviceData.countryId))
              .map((state) => (
                <option key={state._id} value={state.name}>
                  {state.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <div className='flex'>
          <input
            type="number"
            id="latitude"
            name="latitude"
            className="input-field mr-2"
            placeholder="Latitude"
            value={deviceData.latitude}
            onChange={handleChange}
          />
          <input
            type="number"
            id="longitude"
            name="longitude"
            className="input-field"
            placeholder="Longitude"
            value={deviceData.longitude}
            onChange={handleChange}
          />
          </div>
        </div>
        <div className="form-group">
          <select
            id="adminID"
            name="adminID"
            className="input-field custom-select"
            value={deviceData.adminID}
            onChange={handleChange}
          >
            <option value="" disabled>Select Admin</option>
            {admins.map(admin => (
              <option key={admin._id} value={admin._id}>
                {admin.firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="sensors"
            name="sensors"
            className="input-field custom-select"
            value=""
            onChange={(e) => {
              const selectedSensorId = e.target.value;
              const selectedSensor = sensors.find(sensor => sensor._id === selectedSensorId);
              if (selectedSensor && !deviceData.sensors.includes(selectedSensor.sensorReference)) {
                setDeviceData(prevData => ({
                  ...prevData,
                  sensors: [...prevData.sensors, selectedSensor.sensorReference]
                }));
              }
            }}
          >
            <option value="" disabled>Select Sensor</option>
            {sensors.map(sensor => (
              <option key={sensor._id} value={sensor._id}>
                {sensor.sensorReference}
              </option>
            ))}
          </select>
          <div className='selected-sensors'>
          {deviceData.sensors.length > 0 && (
            <ul>
              {deviceData.sensors.map((sensorRef, index) => (
                <li key={index} className='selected-sensor d-inline-block'>
                  {sensorRef}
                  <button type="button" onClick={() => {
                    setDeviceData(prevData => ({
                      ...prevData,
                      sensors: prevData.sensors.filter(ref => ref !== sensorRef)
                    }));
                  }}>
                    <Image src={removeIcon} alt="Remove" width={15} height={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
        <div className="form-group">
          <select
            id="status"
            name="status"
            className="input-field custom-select"
            value={deviceData.status}
            onChange={handleChange}
          >
            <option value="" disabled>Select Status</option>
            <option value="In use">In Use</option>
            <option value="Suspended">Suspended</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Update Device
        </button>
      </form>
    </div>
  );
};

export default EditDevice;
