type Teacher = {
    id: number;
    name: string;
    students: number;
    color: string;
  };
  
  export default function TeachersStudents() {
    const teachers: Teacher[] = [
      { id: 1, name: "Abdullah Sulaiman", students: 20, color: "bg-red-800" },
      { id: 2, name: "Iman Gabel", students: 10, color: "bg-yellow-800" },
      { id: 3, name: "Hassan Ibrahim", students: 40, color: "bg-red-500" },
      { id: 4, name: "Abdullah Sulaiman", students: 20, color: "bg-red-800" },
      { id: 5, name: "Iman Gabel", students: 10, color: "bg-yellow-800" },
      { id: 6, name: "Hassan Ibrahim", students: 40, color: "bg-red-500" },
    ];
  
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 ">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Teachers - Students</h2>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>Teachers</span>
          <span>Students</span>
        </div>
  
        <div className="max-h-48 overflow-y-auto pr-2">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="flex items-center py-[2px] my-1">
              <div className="w-5 flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${teacher.color}`}></div>
              </div>
              <div className="flex-grow truncate">
                <span className="text-xs text-gray-700">{teacher.name}</span>
              </div>
              <div className="w-10 text-right">
                <span className="text-xs">{teacher.students}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  