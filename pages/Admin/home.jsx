import LayoutH from '@components/Admin/layoutH';
import { getTranslations } from '../../app/utils/getTranslations';
import React, {useState,useEffect} from "react";
import HomeA from '@components/Admin/HomeDashContent/Home';
 
const Home = (initialLanguage) => {
    const [language, setLanguage] = useState(initialLanguage);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || initialLanguage;
        setLanguage(storedLanguage);
    }, []);

    return (
        <>
            <LayoutH>
                <div className="mt-3 bg-w">
                    <HomeA />
                </div>
                
             </LayoutH>   
        </>

    );

}
export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale,['sidebar','logout'])
    return {
        props: {
          ...translations,
        },
      };
    }
export default Home;

