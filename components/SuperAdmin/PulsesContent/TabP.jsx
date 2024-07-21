import React, { useState, useEffect } from 'react';
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import DropdownFilter from '../../commun/fliter';
import SearchBar from '@components/Commun/search'; 
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import TableHeaderP from '@components/Commun/Pulses/TabHeaderP'; 
import TableBodyP from '@components/Commun/Pulses/TabBodyP'; 
import AddPulse from '@components/Commun/Popups/Pulses/addPulse';
import { fetchPulses, updatePulseById, deletePulseById } from '@app/utils/apis/pulses'; 

const TableP = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 11;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [refresh, setRefresh] = useState(false); 
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    fetchPulseData();
    const ws = new WebSocket('ws://localhost:3001'); 

    ws.onmessage = (event) => {
      console.log('Raw WebSocket message:', event.data); 
      if (isJson(event.data)) {
        try {
          const message = JSON.parse(event.data);
          if (message.message === 'Pulse created' || message.message === 'Pulse updated') {
            fetchPulseData();
          } else if (message.message === 'Pulse deleted') {
            fetchPulseData();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      } else {
        console.warn('Received non-JSON WebSocket message:', event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [refresh]);

  const isJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchPulseData = async () => {
    try {
      const pulses = await fetchPulses();
      setTableData(pulses);
    } catch (error) {
      console.error('Error fetching pulses:', error);
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deletePulseById(id);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error deleting pulse:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updatePulseById(id, updatedData);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error updating pulse:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
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

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const selectedIds = selectedRows;
      await Promise.all(selectedIds.map(id => deletePulseById(id)));
      setRefresh(!refresh); 
      setShowDeleteConfirmation(false);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected pulses:', error);
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
          <SearchBar />
          <AddButton text="Add Pulse" onClick={toggleForm} />
        </div>
      </div>
      <div className="mt-5 table-container">
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
          <div className="">
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderP handleHeaderCheckboxChange={handleHeaderCheckboxChange} allSelected={allSelected} />
          <TableBodyP
            tableData={tableData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(tableData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddPulse isOpen={isFormOpen} onClose={toggleForm} onPulseAdded={() => setRefresh(!refresh)} />}
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

export default TableP;
