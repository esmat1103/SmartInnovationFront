import React, { useState } from 'react';
import StatBox1 from './StatBox1';
import StatBox2 from './StatBox2';
import StatBox3 from './StatBox3';
import StatBox4 from './StatBox4';
import StatBox5 from './StatBox5';
import StatBox6 from './StatBox6';
import StatBox7 from './StatBox7';
import StatBox8 from './StatBox8';
import StatBox9 from './StatBox9';
import StatBox10 from './StatBox10';
import StatBox11 from './StatBox11';


const HomeSA = () => {          



    return (
        <>
         <h1 className="pl-3 fw600 nunito mt-5 mb-5 white mb-3 f30">Dashboard Overview</h1>

        <div className=' flex '>

            <div className=' pl-2 mx-1'>
               <StatBox1/>
            </div>
            <div className='mx-1'>
              <StatBox2/>
            </div>
            <div className='mx-1'>
              <StatBox3/>
            </div>
            <div className='mx-1'>
              <StatBox4/>
            </div>
            <div className='mx-1'>
              <StatBox5/>
            </div>
        </div>
        <div className='mt-2 flex mx-2'>
            <div className='mx-1 '>
                <StatBox6/>
            </div>
            <div className='mx-1 '>
                <StatBox10/>
            </div>
            <div className='mx-1 '>
                <StatBox7/>
            </div>
        </div>
        <div className='mt-2 flex mx-2'>
            <div className='mx-1 '>
                <StatBox8/>
            </div>
            <div className='mx-1 '>
                <StatBox11/>
            </div>
            <div className='mx-1 '>
                <StatBox9/>
            </div>
        </div>
       
    
        </>
     );
};


export default HomeSA;