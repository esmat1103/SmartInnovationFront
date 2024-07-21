import React, { useState } from 'react';
import Image from 'next/image';
import deleteIcon from '../../../public/assets/Table/delete.svg';
import editIcon from '../../../public/assets/Table/edit.svg';
import exportIcon from '../../../public/assets/Table/export.svg';
import DeleteConfirmation from '@components/Commun/Popups/Devices/DeleteConfirmationModal';
import SensorsPopup from '@components/Commun/Popups/Devices/SensorsPopup';
import EditDevice from '@components/Commun/Popups/Devices/editDevice';
import { getDeviceById, deleteDeviceById } from '@app/utils/apis/devices'; 

const TableBodyD = ({ tableData, selectedRows, handleCheckboxChange, refreshData }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isSensorsPopupVisible, setIsSensorsPopupVisible] = useState(false);
  const [editDeviceData, setEditDeviceData] = useState(null);
  const [deviceSensors, setDeviceSensors] = useState([]);

  const handleEditClick = (_id) => {
    const deviceToEdit = tableData.find((item) => item._id === _id);
    const deviceDataWithId = { ...deviceToEdit, id: deviceToEdit._id };
    setEditDeviceData(deviceDataWithId);
    setIsPopupVisible(true);
  };

  const handleDeleteClick = (_id) => {
    setShowDeleteConfirmation(true);
    setDeleteItem(_id);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeviceById(deleteItem);
      refreshData(); // Automatically refresh data after deletion
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setIsSensorsPopupVisible(false);
    setEditDeviceData(null);
    setDeviceSensors([]);
  };

  const handleButtonClick = async (_id) => {
    try {
      const device = await getDeviceById(_id);
      setDeviceSensors(device.sensors || []);
      setIsSensorsPopupVisible(true);
    } catch (error) {
      console.error('Failed to fetch device sensors:', error);
    }
  };

  return (
    <>
      <tbody className='darkgrey'>
        {tableData.map((row, index) => (
          <tr key={index} className="table-row-box nunito f12">
            <td>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleCheckboxChange(row._id)}
              />
            </td>
            <td className="centered-cell">
              <div className="box-cell f11">{row.ref}</div>
            </td>
            <td className='f11 nunito pl23 darkgrey '>{row.deviceName}</td>
            <td className='f11 nunito  fw600 darkgrey'>{row.macAddress}</td>
            <td className='f11 nunito pl17'>
              <div className="box-cell f11">{row.countryName}</div>
            </td>
            <td className='f11 nunito pl17'>
              <div className="box-cell f11">{row.state}</div>
            </td>
            <td className='f11 nunito pl23'>{row.admin}</td>
            <td className='f11 nunito pl50'>{row.clients}</td>
            <td className='f11 nunito pl23'>
              <button className="box-cell f11 button-like" onClick={() => handleButtonClick(row._id)}>
                {row.sensors.length}
              </button>
            </td>
            <td className="f11 nunito  ">
              <div className={row.status === 'Enabled' ? 'box-cellE f11' : 'box-cellD f11'}>
                {row.status}
              </div>
            </td>
            <td className="text-center">
              <div className="flex justify-center ">
                <button onClick={() => handleEditClick(row._id)}>
                  <Image src={editIcon} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => handleDeleteClick(row._id)}>
                  <Image src={exportIcon} alt='export' width={20} height={20} />
                </button>
                <button onClick={() => handleDeleteClick(row._id)}>
                  <Image src={deleteIcon} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isPopupVisible && (
        <EditDevice
          initialDeviceData={editDeviceData}
          isOpen={isPopupVisible}
          onClose={closePopup}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={confirmDelete}
          onCancelDelete={() => setShowDeleteConfirmation(false)}
        />
      )}
      {isSensorsPopupVisible && (
        <SensorsPopup
          closePopup={closePopup}
          sensors={deviceSensors} 
        />
      )}
    </>
  );
};

export default TableBodyD;
