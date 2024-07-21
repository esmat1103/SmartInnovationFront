import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '../../Alerts/success-alert';
import ErrorAlert from '../../Alerts/error-alert';
import { updateSensorById } from '@app/utils/apis/sensors'; 
import { fetchUnits } from '@app/utils/apis/units'; 

const EditSensor = ({ isOpen, onClose, initialSensorData }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [sensorData, setSensorData] = useState(initialSensorData || {});
  const [units, setUnits] = useState([]); 
  const [showAdditionalFields, setShowAdditionalFields] = useState(initialSensorData && initialSensorData.pulse === 'Yes');
  const timeoutRef = useRef(null);

  const closeSuccessAlert = () => setShowSuccessAlert(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

  const validateForm = () => {
    const requiredFields = ['sensorReference', 'sensorName', 'unit', 'rangeMin', 'rangeMax', 'thresholdMin', 'thresholdMax', 'pulse'];
    
    for (const field of requiredFields) {
      if (!sensorData[field]) {
        setErrorAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }
    
    if (showAdditionalFields && (sensorData.pulse === 'Yes') && (!sensorData.coefficient || !sensorData.startIndex)) {
      setErrorAlertMessage('Please fill in all the required fields!');
      setShowErrorAlert(true);
      return false;
    }
    
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const updatedData = {
        sensorReference: sensorData.sensorReference,
        sensorName: sensorData.sensorName,
        unit: sensorData.unit,
        rangeMin: sensorData.rangeMin,
        rangeMax: sensorData.rangeMax,
        thresholdMin: sensorData.thresholdMin,
        thresholdMax: sensorData.thresholdMax,
        pulse: sensorData.pulse,
        coefficient: sensorData.pulse === 'No' ? '0' : sensorData.coefficient,
        startIndex: sensorData.pulse === 'No' ? '0' : sensorData.startIndex
      };
      await updateSensorById(sensorData._id, updatedData); 
      setShowSuccessAlert(true);
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating sensor:', error);
      setErrorAlertMessage('Error updating sensor: ' + (error.response?.data?.message || error.message));
      setShowErrorAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSensorData({ ...sensorData, [name]: value });
  };

  const handlePulseChange = (e) => {
    const pulseValue = e.target.value;
    setSensorData({ ...sensorData, pulse: pulseValue });
    setShowAdditionalFields(pulseValue === 'Yes');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialSensorData) {
      setSensorData(initialSensorData);
      setShowAdditionalFields(initialSensorData.pulse === 'Yes');
    }
  }, [initialSensorData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitsData = await fetchUnits(); 
        setUnits(unitsData);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchData();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Sensor updated successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorAlertMessage} onClose={closeErrorAlert} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="sensorReference"
            name="sensorReference"
            className="input-field"
            placeholder="Sensor Reference"
            value={sensorData.sensorReference || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="sensorName"
            name="sensorName"
            className="input-field"
            placeholder="Sensor Name"
            value={sensorData.sensorName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group select-container">
          <select
            id="unit"
            name="unit"
            className="input-field custom-select"
            value={sensorData.unit || ''}
            onChange={handleChange}
          >
            <option value="" disabled>Select Unit</option>
            {units.map((unit) => (
              <option key={unit._id} value={unit.unitName}>{unit.unitName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <div className='flex'>
            <input
              type="number"
              id="rangeMin"
              name="rangeMin"
              className="input-field mr-2"
              placeholder="Range Min"
              value={sensorData.rangeMin || ''}
              onChange={handleChange}
            />
            <input
              type="number"
              id="rangeMax"
              name="rangeMax"
              className="input-field"
              placeholder="Range Max"
              value={sensorData.rangeMax || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <div className='flex'>
            <input
              type="number"
              id="thresholdMin"
              name="thresholdMin"
              className="input-field mr-2"
              placeholder="Threshold Min"
              value={sensorData.thresholdMin || ''}
              onChange={handleChange}
            />
            <input
              type="number"
              id="thresholdMax"
              name="thresholdMax"
              className="input-field"
              placeholder="Threshold Max"
              value={sensorData.thresholdMax || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group select-container">
          <select
            id="pulse"
            name="pulse"
            className="input-field custom-select"
            value={sensorData.pulse || ''}
            onChange={handlePulseChange}
          >
            <option value="" disabled>Select Pulse</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {showAdditionalFields && (
          <>
            <div className="form-group">
              <input
                type="number"
                id="coefficient"
                name="coefficient"
                className="input-field"
                placeholder="Coefficient"
                value={sensorData.coefficient || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                id="startIndex"
                name="startIndex"
                className="input-field"
                placeholder="Start Index"
                value={sensorData.startIndex || ''}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className="form-group">
          <button type="submit" className="submit-button">Update Sensor</button>
        </div>
      </form>
    </div>
  );
};

export default EditSensor;
