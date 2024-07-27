import React, { useState, useEffect } from 'react';
import TableHeaderD from '@components/Commun/Devices/TabHeaderD';
import TableBodyD from '@components/Commun/Devices/TabBodyD'; 
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import SearchBar from '@components/Commun/search';
import DropdownFilter from '@components/Commun/Filter';
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import { getDevicesByAdminId, updateDeviceById, deleteDeviceById } from '@app/utils/apis/devices';
import jwt from 'jsonwebtoken';

const TableD = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in local storage');
        }
    
        console.log('Token from localStorage:', token);
        const decodedToken = jwt.decode(token);
        console.log('Decoded token:', decodedToken);
    
        if (!decodedToken || !decodedToken.userId) {
          throw new Error('Invalid token or unable to extract userId');
        }
    
        const loggedInAdminId = decodedToken.userId;
        console.log('Retrieved userId from token:', loggedInAdminId);
    
        const data = await getDevicesByAdminId(loggedInAdminId);
        console.log('Fetched devices data:', data);
        setTableData(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError('Failed to fetch devices.');
      }
    };
    
    fetchDeviceData();

    const ws = new WebSocket('ws://localhost:4002');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      if (data.message === 'Device created' || data.message === 'Device updated' || data.message === 'Device deleted') {
        console.log('WebSocket event: Device change detected');
        fetchDeviceData(); 
      }
    };

    return () => {
      ws.close();
    };
  }, [refresh]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting device with ID:', id);
      await deleteDeviceById(id);
      console.log('Device deleted successfully');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      console.log('Updating device with ID:', id, 'with data:', updatedData);
      await updateDeviceById(id, updatedData);
      console.log('Device updated successfully');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    console.log('Checkbox change for row ID:', id);
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
    console.log('Selected rows:', selectedRows);
  };

  const handleHeaderCheckboxChange = () => {
    setAllSelected(!allSelected);
    setSelectedRows(allSelected ? [] : tableData.map((row) => row._id));
    console.log('Header checkbox change, allSelected:', !allSelected, 'selectedRows:', selectedRows);
  };

  const onPageChange = (page) => {
    console.log('Page change:', page);
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  const handleDeleteSelected = () => {
    console.log('Delete selected rows:', selectedRows);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Confirm delete for selected rows:', selectedRows);
      const selectedIds = selectedRows;
      await Promise.all(selectedIds.map(id => deleteDeviceById(id)));
      console.log('Selected devices deleted successfully');
      setRefresh(!refresh);
      setSelectedRows([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting selected devices:', error);
    }
  };

  const cancelDelete = () => {
    console.log('Cancel delete');
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar />
        </div>
      </div>
      <div className='mt-5 table-container'>
        <div className="filters-container flex justify-between">
          <div className="delete-button-container">
            {selectedRows.length > 0 && (
              <DeleteAllButton
                onClick={handleDeleteSelected}
                hovered={hovered}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                buttonText="Delete Selected"
                imageSrc={deleteW}
                altText="delete"
              />
            )}
          </div>
          <div className=''>
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderD handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBodyD
            tableData={tableData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className='pagination-container'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(tableData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TableD;
