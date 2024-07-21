import React, { useState, useEffect } from 'react';
import TableHeader from '@components/Commun/clients/TabHeader';
import TableBody from '@components/Commun/Admins/TabBody';
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '../../../public/assets/Table/deleteW.svg';
import Pagination from '../../Commun/Pagination';
import SearchBar from '@components/Commun/search';
import DateFilter from '@components/Commun/date-filter';
import DropdownFilter from '../../commun/fliter';
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import AddAdmin from '@components/Commun/Popups/Admins/AddForm';
import axios from 'axios';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const rowsPerPage = 10;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3008/users/role/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTableData(response.data);
      setFilteredData(response.data);
      console.log('Fetched Admins Data:', response.data);
    } catch (error) {
      setError('Error fetching admins');
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();

    const ws = new WebSocket('ws://localhost:3008');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.message === 'Admin created' || data.message === 'User deleted' || data.message === 'Admin updated') {
        fetchAdmins(); 
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close(); 
    };
  }, []);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3008/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAdmins(); 
    } catch (error) {
      setError('Error deleting admin');
      console.error('Error deleting admin:', error);
    }
  };
  
  const handleEdit = (id) => {
    console.log('Editing admin with id:', id);
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map(row => row._id));
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    selectedRows.forEach(id => handleDelete(id));
    setSelectedRows([]);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const filtered = tableData.filter(row => new Date(row.createdAt).toDateString() === date.toDateString());
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar />
          <AddButton text="Add Admin" onClick={toggleForm} />
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
          <div className='flex mt-2 mb-1'>
            <DateFilter onChange={handleDateChange} />
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="table-auto">
          <TableHeader handleHeaderCheckboxChange={handleHeaderCheckboxChange} />
          <TableBody
            tableData={filteredData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className='pagination-container'>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddAdmin isOpen={isFormOpen} onClose={toggleForm} />}
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

export default Table;