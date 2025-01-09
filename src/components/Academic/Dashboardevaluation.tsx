import React, { useEffect, useState } from 'react';

type StudentData = {
  id: number;
  name: string;
  mobile: string;
  country: string;
  preferredTeacher: string;
  date: string;
  time: string;
};

const StudentEvaluation = () => {
  const [evaluationList, setEvaluationList] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from API
    const auth=localStorage.getItem('authToken');
    fetch('http://alfurqanacademy.tech:5001/evaluationlist',{
      headers: {
        'Authorization': `Bearer ${auth}`,        
          },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedData: StudentData[] = data.evaluation.map((item: { student: { studentFirstName: string; studentLastName: string; studentPhone: string; studentCountry: string; preferredTeacher: string; preferredDate: string; preferredFromTime: string; preferredToTime: string; }; }, index: number) => ({
          id: index + 1,
          name: `${item.student.studentFirstName} ${item.student.studentLastName}`,
          mobile: item.student.studentPhone,
          country: item.student.studentCountry,
          preferredTeacher: item.student.preferredTeacher,
          date: new Date(item.student.preferredDate).toLocaleDateString(),
          time: `${item.student.preferredFromTime} - ${item.student.preferredToTime}`,
        }));
        setEvaluationList(formattedData.slice(-5)); // Keep only the latest 5 records
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="col-span-12 bg-[#CED4DC] p-0 rounded-[30px] shadow mb-2">
      <h3 className="text-[15px] font-medium ml-4 mt-2 text-[#0A0338]">Student Evaluation</h3>
      <table className="w-full mt-1">
        <thead>
          <tr className="text-center border-b text-[13px]">
            <th className="p-2">Trail</th>
            <th className="p-2">Name</th>
            <th className="p-2">Mobile</th>
            <th className="p-2">Country</th>
            <th className="p-2">Preferred Teacher</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {evaluationList.map((item) => (
            <tr key={item.id} className="border-b text-[11px] text-center">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.mobile}</td>
              <td className="p-2">{item.country}</td>
              <td className="p-2">{item.preferredTeacher}</td>
              <td className="p-2">{item.date}</td>
              <td className="p-2">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentEvaluation;
