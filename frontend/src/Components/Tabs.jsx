import { Typography } from '@material-tailwind/react';
import React, { useState } from 'react';

function Tabs(props) {
    const { data } = props;
    const [tab, setTab] = useState('info');

    return (
        <div className='  md:max-w-[70%] mx-auto rounded overflow-hidden bg-white p-5 shadow-xl'>
            
            <div className='grid md:grid-cols-4 gap-3'>
            <div className='col-span-3 md:col-span-1 p-3 bg-[#F0F2F5] rounded'>
            <Typography variant='h5' color='gray' className='mb-3 ml-4 text-center'> Update user</Typography>
                <ul>
                    {data.map((item) => (
                        <li
                            key={item.value}
                            className={`py-2 px-3 rounded cursor-pointer   transition-colors duration-300 ease-in-out ${
                                item.value === tab ? 'bg-white' : 'hover:bg-[#00a2ff13] hover:text-blue-900'
                            }`}
                            onClick={() => setTab(item.value)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='col-span-3 transition-opacity duration-300 ease-in-out'>
                {data.find((item) => item.value === tab)?.body}
            </div>
            </div>

        </div>
    );
}

export default Tabs;
