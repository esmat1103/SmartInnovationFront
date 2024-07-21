import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const TableHeaderS = ({ handleHeaderCheckboxChange, allSelected }) => {
  const [language, setLanguage] = useState('en'); 
  const { t } = useTranslation('HeaderSensorsTab'); 

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) { 
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <thead className="table-header darkgrey">
      <tr className="table-header-row f12 nunito">
        <th>
          <input 
            type="checkbox" 
            className="custom-checkbox" 
            onChange={handleHeaderCheckboxChange} 
            checked={allSelected}
          />
        </th>
        <th>{t('ref')}</th>
        <th>{t('name')}</th>
        <th>{t('unit')}</th>
        <th>{t('rangeMin')}</th>
        <th>{t('rangeMax')}</th>
        <th>{t('thresholdMin')}</th>
        <th>{t('thresholdMax')}</th>
        <th className="pl54">{t('pulse')}</th>
        <th>{t('startIndex')}</th>
        <th>{t('Coefficient')}</th>
        <th>{t('parameters')}</th>
        <th>{t('state')}</th>
        <th className="center">{t('actions')}</th>
      </tr>
    </thead>
  );
};

export default TableHeaderS;
