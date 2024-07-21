import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Notification from '/public/assets/Navbar/notif.svg';
import Pic from '/public/assets/Navbar/picture.jpg';
import NotificationPopup from '@components/Admin/notification';

const Navbar = () => {
    const [language, setLanguage] = useState('en');
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    const toggleLanguage = () => {
        let newLanguage = 'en'; // Default to English
        if (language === 'en') {
            newLanguage = 'fr'; // Toggle to French
        } else if (language === 'fr') {
            newLanguage = 'ar'; // Toggle to Arabic
        } else {
            newLanguage = 'en'; // Toggle back to English if current language is Arabic
        }
        
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        router.push(router.pathname, router.asPath, { locale: newLanguage });
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <nav className="navbar fixed flex justify-between items-center bg p-4 z-10 w-full">
            <div className="flex items-center ml-auto">
                <div className="icons-container mt-2 mr-2 flex">
                    <button className="flag-button" onClick={toggleLanguage}>
                        {language === 'en' ? (
                            <span className="fi fi-gb"></span>
                        ) : language === 'fr' ? (
                            <span className="fi fi-fr"></span>
                        ) : (
                            <span className="fi fi-sa"></span>
                        )}
                    </button>
                </div>

                <div className="icons-container mt-2 mr-2 flex items-center justify-center">
                    <button className="flex items-center justify-center text-white p-0 m-0" onClick={togglePopup}>
                        <Image src={Notification} alt='notification' width={15} id="notification-icon" className='m-0' />
                    </button>
                </div>

                {isPopupOpen && <NotificationPopup onClose={togglePopup} />}
                
                <div className="profile-container mt-2 mr-2 flex items-center justify-center">
                    <button className="flex items-center justify-center text-white p-0 m-0">
                        <Image src={Pic} alt='pic' id="profile-pic" className='m-0' />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
