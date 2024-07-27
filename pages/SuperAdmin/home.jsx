// pages/SuperAdmin/home.js
import LayoutH from '@components/SuperAdmin/layoutH';
import { getTranslations } from '../../app/utils/getTranslations';
import React, { useState, useEffect } from "react";
import HomeSA from '@components/SuperAdmin/HomeDashContent/Home';

const Home = (props) => {
    const [language, setLanguage] = useState(props.initialLanguage || 'en');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') || language;
        setLanguage(storedLanguage);
    }, [language]);

    return (
        <>
            <LayoutH>
               <HomeSA/>
           </LayoutH>   
        </>
    );
};

export const getServerSideProps = async ({ locale }) => {
    const translations = await getTranslations(locale, ['sidebar', 'logout']);
    return {
        props: {
            ...translations,
            initialLanguage: locale,
        },
    };
};

export default Home;
