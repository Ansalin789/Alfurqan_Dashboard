import BaseLayout from '@/components/BaseLayout'
import React from 'react'
import DashboardClasses from '../../components/schedule'
import SalaryCard from '../../components/classTable'
import BaseLayout4 from '@/components/BaseLayout4'


const Classes = () => {
  return (
    <BaseLayout4>
       {/* <TeacherHeader currentSection="Schedule Classes" /> */}
        <div className=' mx-auto W-full'>
            <DashboardClasses />
            <SalaryCard />
        </div>
    </BaseLayout4>
  )
}

export default Classes