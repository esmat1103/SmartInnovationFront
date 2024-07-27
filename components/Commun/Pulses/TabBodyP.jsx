import React, { useState } from 'react';
import Image from 'next/image';
import export1 from '../../../public/assets/Table/export.svg';
import edit from '../../../public/assets/Table/edit.svg';
import clear from '../../../public/assets/Table/delete.svg';
import DeleteConfirmation from '@components/Commun/Popups/Sensors/DeleteConfirmationModal';
import EditPulse from '@components/Commun/Popups/Pulses/editPulse';
import { deletePulseById } from '@app/utils/apis/pulses';

const TableBodyP = ({ tableData, selectedRows, handleCheckboxChange }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editPulseData, setEditPulseData] = useState(null);

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = (_id) => {
    const pulseToEdit = tableData.find((item) => item._id === _id);
    const pulseDataWithId = { ...pulseToEdit, id: pulseToEdit._id };
    setEditPulseData(pulseDataWithId);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setEditPulseData(null);
  };

  const handleDelete = (_id) => {
    setShowDeleteConfirmation(true);
    setDeleteItem(_id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePulseById(deleteItem); 
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting pulse:', error);
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
            <td><div className="box-cell f12">{row.Name}</div></td>
            <td><div className="box-cell f12">{row.Unit}</div></td>
            <td><div className="box-cell f12">{row.Description}</div></td>
            <td className='text-center pl23'>
              <div className="flex justify-end">
                <button onClick={() => handleEditClick(row._id)}>
                  <Image src={edit} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => handleDelete(row._id)}>
                  <Image src={clear} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {isPopupVisible && (
        <EditPulse
          initialPulseData={editPulseData}
          isOpen={isPopupVisible}
          onClose={closePopup}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={handleConfirmDelete}
          onCancelDelete={cancelDelete}
        />
      )}
    </>
  );
};

export default TableBodyP;
