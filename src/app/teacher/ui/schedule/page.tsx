import BaseLayout from '@/components/BaseLayout'
import React from 'react'
import NextClass from '../../components/NextClass'
import ScheduledClasses from '../../components/ScheduledClasses'

const Schedules = () => {
  return (
    <BaseLayout>
        <div>
            <NextClass />
            <ScheduledClasses />
        </div>
    </BaseLayout>
  )
}

export default Schedules