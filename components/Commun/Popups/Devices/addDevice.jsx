import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import { createDevice } from '@app/utils/apis/devices';
import { fetchCountries, fetchStates } from '@app/utils/apis/location'; 
import { fetchSensors } from '@app/utils/apis/sensors';
import removeIcon from '/public/assets/Table/delete.svg'; 

const AddDevice = ({ isOpen, onClose, onDeviceAdded }) => {
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
    admin: '',
    clients: '',
    sensors: [],
    status: '',
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [sensors, setSensors] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesData, statesData, sensorsData] = await Promise.all([fetchCountries(), fetchStates(), fetchSensors()]);
        setCountries(countriesData);
        setStates(statesData);
        setSensors(sensorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCloseAlerts = () => {
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sensors') {
      const selectedSensor = sensors.find(sensor => sensor._id.toString() === value);
      if (selectedSensor && !deviceData.sensors.includes(selectedSensor.sensorReference)) {
        setDeviceData({ ...deviceData, sensors: [...deviceData.sensors, selectedSensor.sensorReference] });
      }
    } else if (name === 'countryId') {
      const selectedCountry = countries.find(country => String(country.id) === value);
      setDeviceData({ 
        ...deviceData, 
        countryId: value, 
        countryName: selectedCountry ? selectedCountry.name : '' 
      });
    } else {
      setDeviceData({ ...deviceData, [name]: value });
    }
  };

  const validateForm = () => {
    const requiredFields = ['ref', 'deviceName', 'macAddress', 'countryId', 'state', 'admin', 'clients', 'status'];
    for (const field of requiredFields) {
      if (!deviceData[field]) {
        setAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newDeviceData = {
        ...deviceData,
      };

      const newDevice = await createDevice(newDeviceData);
      setShowSuccessAlert(true);
      onDeviceAdded();

      timeoutRef.current = setTimeout(() => {
        setDeviceData({
          ref: '',
          deviceName: '',
          macAddress: '',
          countryId: '',
          countryName: '',
          state: '',
          admin: '',
          clients: '',
          sensors: [],
          status: '',
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding device:', error);
      setAlertMessage('Error adding device');
      setShowErrorAlert(true);
    }
  };

  const handleRemoveSensor = (sensorReference) => {
    setDeviceData({
      ...deviceData,
      sensors: deviceData.sensors.filter(sensor => sensor !== sensorReference),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Device added successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="ref"
            name="ref"
            className="input-field"
            placeholder="ID"
            value={deviceData.ref}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
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
              <option key={country._id} value={country.id}>
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
          <input
            type="text"
            id="admin"
            name="admin"
            className="input-field"
            placeholder="Admin"
            value={deviceData.admin}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="clients"
            name="clients"
            className="input-field"
            placeholder="Clients"
            value={deviceData.clients}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <select
            id="sensors"
            name="sensors"
            className="input-field custom-select"
            value=""
            onChange={handleChange}
          >
            <option value="" disabled>Select Sensor</option>
            {sensors
              .filter(sensor => !deviceData.sensors.includes(sensor.sensorReference))
              .map((sensor) => (
                <option key={sensor._id} value={sensor._id}>
                  {sensor.sensorReference}
                </option>
              ))}
          </select>
          <div className="selected-sensors">
            {deviceData.sensors.map(sensor => (
              <div key={sensor} className="selected-sensor d-inline-block">
                {sensor} 
                <button type="button" onClick={() => handleRemoveSensor(sensor)}>  
                  <Image src={removeIcon} alt="Remove" height={10} width={12} className='pic' />
                </button>
              </div>
            ))}
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
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Add Device</button>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;
