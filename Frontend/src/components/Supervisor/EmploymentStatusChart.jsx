import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmploymentStatusChart = () => {
  const data = {
    labels: ['Full Time', 'Part Time'],
    datasets: [
      {
        data: [67, 33],
        backgroundColor: ['#00FF00', '#FFA500'],
        hoverBackgroundColor: ['#00CC00', '#FF9900'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white p-0 rounded-lg">
      <h3 className="text-xl font-semibold mb-0">Employment Status</h3>
      <div className="text-center">
      <p className="text-sm text-gray-500">Total Employment</p>
        <h3 className="text-xl font-bold">1342</h3>
      </div>
      <div className="relative flex justify-center items-center h-20 w-20 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xs font-semibold">67%</p>
            <p className="text-[10px] text-gray-600">Full Time</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm mt-4">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <p>Full Time</p>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          <p>Part Time</p>
        </div>
      </div>
    </div>
  );
};

export default EmploymentStatusChart;
