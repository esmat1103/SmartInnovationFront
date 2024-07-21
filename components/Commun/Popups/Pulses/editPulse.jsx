import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert'; 
import ErrorAlert from '@components/Commun/Alerts/error-alert'; 
import { updatePulseById } from '@app/utils/apis/pulses';

const EditPulse = ({ isOpen, onClose, initialPulseData }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [pulseData, setPulseData] = useState(initialPulseData || {});
  const timeoutRef = useRef(null);

  const closeSuccessAlert = () => setShowSuccessAlert(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

  const validateForm = () => {
    console.log('Pulse Data:', pulseData);

    const requiredFields = ['pulseName', 'pulseValue'];

    for (const field of requiredFields) {
      if (!pulseData[field]) {
        setErrorAlertMessage('Please fill in all the required fields!');
        setShowErrorAlert(true);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const updatedData = {
        pulseName: pulseData.pulseName,
        pulseValue: pulseData.pulseValue,
      
      };
      await updatePulseById(pulseData._id, updatedData);
      console.log('Pulse ID:', pulseData._id);
      setShowSuccessAlert(true);
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error updating pulse:', error);
      setErrorAlertMessage('Error updating pulse: ' + (error.response?.data?.message || error.message));
      setShowErrorAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPulseData({ ...pulseData, [name]: value });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialPulseData) {
      setPulseData(initialPulseData);
    }
  }, [initialPulseData]);

  if (!isOpen) return null;

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Pulse updated successfully!" onClose={closeSuccessAlert} />}
      {showErrorAlert && <ErrorAlert message={errorAlertMessage} onClose={closeErrorAlert} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="pulseName"
            name="pulseName"
            className="input-field"
            placeholder="Pulse Name"
            value={pulseData.pulseName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="pulseValue"
            name="pulseValue"
            className="input-field"
            placeholder="Pulse Value"
            value={pulseData.pulseValue || ''}
            onChange={handleChange}
          />
        </div>
       
        <div className="form-group">
          <button type="submit" className="submit-button">Update Pulse</button>
        </div>
      </form>
    </div>
  );
};

export default EditPulse;
