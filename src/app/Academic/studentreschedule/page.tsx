import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React from 'react';

const Studentreschedule = () => {
  return (
    <div>
      <BaseLayout1>
        <div className="flex flex-col lg:flex-row lg:justify-between p-6">
        <div className="col-span-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 550 }}
                  views={['month']}
                  defaultView="month"
                  toolbar={false}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: '#E9EBFF',
                      color: '#012A4A',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      fontSize:'7px',
                      width:'60px'
                    },
                  })}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          <div className="w-full lg:w-1/3 p-4 rounded-lg mt-6 lg:mt-0">
            <h2 className="text-[15px] font-semibold mb-4 text-[#012A4A]">Select your Teacher and time Slot to Reschedule your class*</h2>
            <div>
              {['Zayn Wills', 'Flynn Parker', 'Fesco James', 'Raphinya', 'Neymar Jr'].map((teacher, index) => (
                <div key={index} className="flex items-center justify-between p-2 mb-2 bg-white shadow-lg rounded-lg">
                  <div className="flex items-center">
                    <Image src={`/assets/images/alf1.png`} width={50} height={50} alt={teacher} className="w-10 h-10 rounded-full mr-2" />
                    <div>
                      <p className="text-[12px] font-medium">{teacher}</p>
                      <p className="text-[11px] text-gray-600">Level: 3</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-600">9.00 Am to 11.00 Am</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseLayout1>
    </div>
  );
}

export default Studentreschedule;
