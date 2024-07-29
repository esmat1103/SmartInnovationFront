import React, { useState, useEffect } from 'react';
import TableHeaderD from '@components/Commun/Devices/TabHeaderD'; 
import TableBodyD from '../../Commun/Devices/TabBodyD'; 
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import SearchBar from '@components/Commun/search'; 
import DropdownFilter from '../../commun/fliter'; 
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import AddDevice from '@components/Commun/Popups/Devices/addDevice';
import { fetchDevices, deleteDeviceById } from '@app/utils/apis/devices';
import { updateSensorById, fetchSensors } from '@app/utils/apis/sensors';

const TableD = () => { 
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState(''); 


  const filterOptions = {
    'All devices':'',
    'Devices under Maintenance': 'Maintenance',
    'Devices in Use': 'In use',
    'Devices suspended': 'Suspended'
  };

  useEffect(() => {
    fetchDeviceData();
    const ws = new WebSocket('ws://localhost:4002');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);

      if (data.message === 'Device created' || data.message === 'Device updated' || data.message === 'Device deleted') {
        fetchDeviceData(); 
      }
    };

    return () => {
      ws.close();
    };
  }, [refresh]);

  const fetchDeviceData = async () => {
    try {
      const data = await fetchDevices();
      setTableData(data);
      filterData(data, searchTerm, filterOption); 
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices.');
    }
  };

  const filterData = (data, searchTerm, filterOption) => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(device =>
        Object.values(device).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOption) {
      filtered = filtered.filter(device => device.status === filterOption);
    }

    setFilteredData(filtered);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeviceById(id);
      setRefresh(!refresh);
      fetchDeviceData(); 
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updateDeviceById(id, updatedData);
      setRefresh(!refresh);
      fetchDeviceData(); 
    } catch (error) {
      console.error('Error updating device:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    setAllSelected(!allSelected);
    setSelectedRows(allSelected ? [] : tableData.map((row) => row._id));
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    filterData(tableData, value, filterOption);
  };

  const handleFilterChange = (description) => {
    const internalValue = filterOptions[description] || '';
    setFilterOption(internalValue);
    filterData(tableData, searchTerm, internalValue);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const deviceToDelete = tableData.find((item) => item._id === deleteItem);
      if (deviceToDelete && deviceToDelete.sensors) {
        const sensors = await fetchSensors();

        await Promise.all(
          deviceToDelete.sensors.map(async (sensorReference) => {
            const sensor = sensors.find((s) => s.sensorReference === sensorReference);
            if (sensor) {
              await updateSensorById(sensor._id, { deviceID: null });
            }
          })
        );
      }

      await deleteDeviceById(deleteItem);
      setRefresh(!refresh); 
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting device or updating sensors:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar onChange={handleSearchChange} />
          <AddButton text="Add Device" onClick={toggleForm} />
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
            <DropdownFilter 
              options={Object.keys(filterOptions)} 
              onChange={handleFilterChange}  
            />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderD handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBodyD
            tableData={filteredData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
            refreshData={() => setRefresh(!refresh)} 
          />
        </table>
        <div className='pagination-container'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddDevice isOpen={isFormOpen} onClose={toggleForm} onDeviceAdded={() => setRefresh(!refresh)} />}
        {isFormOpen && <div className="table-overlay"></div>}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={confirmDelete}
          onCancelDelete={cancelDelete}
        />
      )}
    </div>
  );
};

export default TableD;
