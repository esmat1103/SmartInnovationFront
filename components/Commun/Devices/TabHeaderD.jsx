import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const TableHeaderD = ({ handleHeaderCheckboxChange }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderDevicesTab'); 


  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  
  return (
    <thead className="table-header darkgrey">
      <tr className="table-header-row">
        <th>
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            onChange={handleHeaderCheckboxChange} 
          />
        </th>
        <th className='f12 nunito'>{t('id')}</th>
        <th className='f12 nunito pl23'>{t('name')}</th>
        <th className='f12 nunito'>{t('macAddress')}</th>
        <th className='f12 nunito pl17'>{t('country')}</th>
        <th className='f12 nunito pl17'>{t('state')}</th>
        <th className='f12 nunito pl23'>{t('admin')}</th>
        <th className='f12 nunito pl50'>{t('clients')}</th>
        <th className='f12 nunito pr30'>{t('sensors')}</th>
        <th className='f12 nunito pl70'>{t('status')}</th>
        <th className='f12 nunito pl35'>{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeaderD;
