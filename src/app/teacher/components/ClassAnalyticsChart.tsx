import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const ClassAnalyticsChart = () => {
  const data = {
    labels: ['Scheduled', 'Completed', 'Absent'],
    datasets: [
      {
        data: [70, 28, 2], // Scheduled: 70%, Completed: 28%, Absent: 2%
        backgroundColor: ['#FBBF24', '#34D399', '#A78BFA'], // Yellow, Teal Green, Pink
        hoverBackgroundColor: ['#FACC15', '#10B981', '#8B5CF6'], // Hover colors
      },
    ],
  };

  const options = {
    cutout: '70%', // Creates the donut effect
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: { label: any; raw: any; }) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div className="block w-[800px] h-[195px] bg-[#2F4B8B] p-4 rounded-[17px] shadow-md flex justify-between">
      {/* Chart */}
      <div className="relative w-36 h-36 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[20px] font-bold text-white">40</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-white text-sm w-[60%]">
        <h3 className="text-[16px] font-semibold text-center mb-4">Class Analytics</h3>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#FBBF24] mr-2"></span>
            Scheduled (70%)
          </span>
          <span>28</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#34D399] mr-2"></span>
            Completed (28%)
          </span>
          <span>15</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#A78BFA] mr-2"></span>
            Absent (2%)
          </span>
          <span>2</span>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;