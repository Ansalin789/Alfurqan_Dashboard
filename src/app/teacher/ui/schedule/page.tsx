import BaseLayout from '@/components/BaseLayout'
import React from 'react'
import NextClass from '../../components/NextClass'
import ScheduledClasses from '../../components/ScheduledClasses'
import TeacherHeader from '../../components/TeacherHeader'

const Schedules = () => {
  return (
    <BaseLayout>
       <TeacherHeader currentSection="Calender" />
        <div className=' mx-auto W-full'>
            <NextClass />
            <ScheduledClasses />
        </div>
    </BaseLayout>
  )
}

export default Schedules