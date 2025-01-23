import React from 'react'
import Assignment from '../../components/Assignment'
import StudentList from '../../components/StudentsList'
import BaseLayout from '@/components/BaseLayout'

const page = () => {
  return (
    <BaseLayout>
    <div className=''>
      <div className=''>
        <Assignment />
      </div>
      <div>
        <StudentList />
      </div>
    </div>
      
    </BaseLayout>
  )
}

export default page