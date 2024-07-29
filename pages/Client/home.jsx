import React from 'react';
import { getTranslations } from '../../app/utils/getTranslations';
import HomeC from '@components/Client/HomeDashContent/Home';
import LayoutH from '@components/Client/layoutH';

const Home = () => {

    return (
        <>
        <LayoutH>
                <div className="mt-5 bg-w">
                    <HomeC />
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
