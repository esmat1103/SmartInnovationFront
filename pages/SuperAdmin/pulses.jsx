import TableP from '@components/SuperAdmin/PulsesContent/TabP'; 
import { useEffect, useState } from 'react';
import { getTranslations } from '../../app/utils/getTranslations';
import LayoutSuperAdmin from "@components/SuperAdmin/layout";

const Pulses =  ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);
    return (
        <>
        <LayoutSuperAdmin > 
        <div className="mt-5 bg-w">
            <TableP language={language} />
        </div>
        </LayoutSuperAdmin >         
        </>
    );

}

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderPulsesTab','sidebar'])
    return {
        props: {
          ...translations,
        },
      };
    }


export default Pulses;