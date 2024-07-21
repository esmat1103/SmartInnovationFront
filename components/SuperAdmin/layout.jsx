import React from 'react';
import SidebarSA from './sidebarSA';
import Content from '../content';
import Navbar from '@components/Commun/navbar';


const LayoutSuperAdmin = ({ children }) => {
    return (
        <div className="flex">
        <SidebarSA />
        <div className="flex flex-col flex-grow">
            <div className="flex flex-grow ">
                <Content >{children}</Content>
            </div>
            <Navbar />
        </div>
    </div>
);
  };
  
export default  LayoutSuperAdmin;
