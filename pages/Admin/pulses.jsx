import TableP from '@components/SuperAdmin/PulsesContent/TabP'; 
import { useEffect, useState } from 'react';
import { getTranslations } from '../../app/utils/getTranslations';
import LayoutAdmin from "@components/Admin/layout";

const Pulses =  ({ initialLanguage }) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, [initialLanguage]);
    return (
        <>
        <LayoutAdmin > 
        <div className="mt-5 bg-w">
            <TableP language={language} />
        </div>
        </LayoutAdmin >         
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