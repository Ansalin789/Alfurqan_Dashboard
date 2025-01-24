import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend,ChartOptions, ChartData, TooltipItem  } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";


Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ClassAnalyticsChart = () => {
  const data: ChartData<"doughnut"> = {
    labels: ["Scheduled", "Completed", "Absent"],
    datasets: [
      {
        data: [60, 28, 12],
        backgroundColor: ["#FEC64F", "#0BF4C8", "#F2A0FF"],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "50%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"doughnut">) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
      datalabels: {
        formatter: (value: number) => `${value}%`,
        color: "white",
        font: {
          weight: 600,
          size: 14,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="w-[100%] h-[205px] bg-[#3E68A1] p-4 rounded-[17px] shadow-lg flex justify-between">
      <div className="relative w-36 h-36 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[20px] font-bold text-white bg-[#223857] rounded-full p-3">
            {total}
          </span>
        </div>
      </div>
      <div className="text-white text-sm w-[60%]">
        <h3 className="text-[16px] font-semibold text-center -ml-40 mb-4">
          Class Analytics
        </h3>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FEC64F] mr-2"></div>
            <p className="text-[#6BF4FD] font-bold">TOTAL CLASS ASSIGNED</p>
          </span>
          <span>{total}</span>
        </div>
        <div className="flex justify-between items-center mt-3 text-[11px] text-[#A098AE]">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-sm bg-[#FEC64F] mr-2"></div>
            Scheduled (70%)
          </span>
          <span>28</span>
        </div>
        <div className="flex justify-between items-center mt-1 text-[11px] text-[#A098AE]">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-sm bg-[#0BF4C8] mr-2"></div>
            Completed (28%)
          </span>
          <span>15</span>
        </div>
        <div className="flex justify-between items-center mt-1 text-[11px] text-[#A098AE]">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-sm bg-[#F2A0FF] mr-2"></div>
            Absent (2%)
          </span>
          <span>2</span>
        </div>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;
