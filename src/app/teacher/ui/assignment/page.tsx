import React from 'react'
import Assignment from '../../components/Assignment'
import StudentList from '../../components/StudentsList'
import BaseLayout from '@/components/BaseLayout'

const page = () => {
  return (
    <BaseLayout>
      <div className='mx-auto'>
          <Assignment />
          <StudentList />
      </div>
    </BaseLayout>
  )
}

export default page