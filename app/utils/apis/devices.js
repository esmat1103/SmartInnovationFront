import axios from 'axios';

const API_URL = 'http://localhost:4002/devices';

export const fetchDevices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDevice = async (device) => {
  const response = await axios.post(API_URL, device);
  return response.data;
};

export const getDeviceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateDeviceById = async (id, updates) => {
  const response = await axios.patch(`${API_URL}/${id}`, updates);
  return response.data;
};

export const deleteDeviceById = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
