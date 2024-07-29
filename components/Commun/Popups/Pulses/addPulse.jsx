import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert';
import ErrorAlert from '@components/Commun/Alerts/error-alert';
import { createPulse } from '@app/utils/apis/pulses';

const AddPulse = ({ isOpen, onClose, onPulseAdded }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [pulseData, setPulseData] = useState({
    name: '',
    unit: '',
    description: '',
    applications: '',
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
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
    setPulseData({ ...pulseData, [name]: value });
  };

  const validateForm = () => {
    const { name, unit, description, applications } = pulseData;
    if (!name.trim() || !unit.trim() || !description.trim() || !applications.trim()) {
      setAlertMessage('Please fill in all the required fields!');
      setShowErrorAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createPulse(pulseData);
      setShowSuccessAlert(true);
      onPulseAdded();
      timeoutRef.current = setTimeout(() => {
        setPulseData({
          name: '',
          unit: '',
          description: '',
          applications: '',
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding pulse:', error);
      setAlertMessage('Error adding pulse!');
      setShowErrorAlert(true);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Pulse added successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            placeholder="Name"
            value={pulseData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="unit"
            name="unit"
            className="input-field"
            placeholder="Unit"
            value={pulseData.unit}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="description"
            name="description"
            className="input-field"
            placeholder="Description"
            value={pulseData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="applications"
            name="applications"
            className="input-field"
            placeholder="Applications"
            value={pulseData.applications}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Add Pulse</button>
        </div>
      </form>
    </div>
  );
};

export default AddPulse;
