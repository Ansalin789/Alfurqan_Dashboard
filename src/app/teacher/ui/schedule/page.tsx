import BaseLayout from '@/components/BaseLayout'
import React from 'react'
import NextClass from '../../components/NextClass'
import ScheduledClasses from '../../components/ScheduledClasses'
import TeacherHeader from '../../components/TeacherHeader'

const Schedules = () => {
  return (
    <BaseLayout>
       <TeacherHeader currentSection="Schedule" />
        <div className='p-4 mx-auto w-[1250px] pr-12'>
            <NextClass />
            <ScheduledClasses />
        </div>
    </BaseLayout>
  )
}

export default Schedules