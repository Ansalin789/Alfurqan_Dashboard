import React from 'react'
import Assignment from '../../components/Assignment'
import StudentList from '../../components/StudentsList'
import BaseLayout from '@/components/BaseLayout'

const page = () => {
  return (
    <BaseLayout>
      <div className='p-4 mx-auto w-[1250px] pr-16'>
          <Assignment />
          <StudentList />
      </div>
    </BaseLayout>
  )
}

export default page