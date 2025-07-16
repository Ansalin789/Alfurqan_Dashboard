import BaseLayout from '@/components/BaseLayout'
import React from 'react'
import DashboardClasses from '../../components/schedule'
import SalaryCard from '../../components/classTable'


const Classes = () => {
  return (
    <BaseLayout>
       {/* <TeacherHeader currentSection="Schedule Classes" /> */}
        <div className=' mx-auto W-full'>
            <DashboardClasses />
            <SalaryCard />
        </div>
    </BaseLayout>
  )
}

export default Classes