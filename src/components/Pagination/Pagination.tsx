// import React from 'react'
import  useState  from 'react';

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

const Pagination = () => {
    const renderPageNumbers = () => {
      const pageNumbers = [];
      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        if (i <= 3 || i > totalPages - 3 || (currentPage >= 4 && currentPage <= totalPages - 3 && (i === currentPage - 1 || i === currentPage + 1))) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {i}
            </button>
          );
        } else if (i === 4 || i === totalPages - 3) {
          pageNumbers.push(<span key={i} className="px-3 py-1">...</span>);
        }
      }

      return pageNumbers;
    };

    return (
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Last
          </button>
        </div>
      </div>
    );
  };

export default Pagination
