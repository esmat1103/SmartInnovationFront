import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import returnIcon from '/public/assets/return.svg';
import SuccessAlert from '@components/Commun/Alerts/success-alert';
import ErrorAlert from '@components/Commun/Alerts/error-alert';
import { createUnit } from '@app/utils/apis/units'; 

const AddUnit = ({ isOpen, onClose, onUnitAdded }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [unitData, setUnitData] = useState({
    unitName: '',
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
    setUnitData({ ...unitData, [name]: value });
  };

  const validateForm = () => {
    const { unitName } = unitData;
    if (!unitName.trim()) {
      setAlertMessage('Please fill in all the required fields !');
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
      const newUnit = await createUnit(unitData);
      setShowSuccessAlert(true);
      onUnitAdded();
      timeoutRef.current = setTimeout(() => {
        setUnitData({
          unitName: '',
        });
        handleCloseAlerts();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding unit:', error);
      setAlertMessage('Error adding unit !');
      setShowErrorAlert(true);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-container-popup nunito">
      {showSuccessAlert && <SuccessAlert message="Unit added successfully!" onClose={handleCloseAlerts} />}
      {showErrorAlert && <ErrorAlert message={alertMessage} onClose={handleCloseAlerts} />}
      <button className="return-button mb-5" onClick={onClose}>
        <Image src={returnIcon} alt="Return" className="return-icon" height={25} />
      </button>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            id="unitName"
            name="unitName"
            className="input-field"
            placeholder="Name"
            value={unitData.unitName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Add Unit</button>
        </div>
      </form>
    </div>
  );
};

export default AddUnit;
