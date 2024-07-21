import TableS from "@components/Admin/SensorsContent/TabS";
import { getTranslations } from '../../app/utils/getTranslations';
import { useEffect, useState } from 'react';
import LayoutSuperAdmin from "@components/SuperAdmin/layout";



const Sensors = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
        <LayoutSuperAdmin >
            <div className="mt-5 bg-w">
                 <TableS />
            </div>
            
        </LayoutSuperAdmin>       
        </>

    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['HeaderSensorsTab','sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default Sensors;