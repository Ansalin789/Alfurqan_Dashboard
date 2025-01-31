'use client';

import React from 'react';
import BaseLayout2 from '@/components/BaseLayout2';
import Assignmentlist from '../../components/assignment/Assignmentlist';
import Assignlist from '../../components/assignment/Assignlist';


const CurrentStatus = () => {
  return (
    <BaseLayout2>
      <div className='p-4 mx-auto w-[1250px] pr-20'>
        <Assignlist />
        <Assignmentlist />
        
      </div>
    </BaseLayout2>
  );
};

export default CurrentStatus;