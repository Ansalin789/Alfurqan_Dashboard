import React, { useState } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { Calendar, Badge, List } from 'rsuite';
import { HStack } from '@chakra-ui/react'; // Assuming you're using Chakra UI for HStack

function getTodoList(date) {
  if (!date) {
    return [];
  }
  const day = date.getDate();

  switch (day) {
    case 10:
      return [
        { time: '10:30 am', title: 'Meeting' },
        { time: '12:00 pm', title: 'Lunch' }
      ];
    case 15:
      return [
        { time: '09:30 pm', title: 'Products Introduction Meeting' },
        { time: '12:30 pm', title: 'Client entertaining' },
        { time: '02:00 pm', title: 'Product design discussion' },
        { time: '05:00 pm', title: 'Product test and acceptance' },
        { time: '06:30 pm', title: 'Reporting' }
      ];
    default:
      return [];
  }
}

function renderCell(date) {
  const list = getTodoList(date);

  if (list.length) {
    return <Badge className="calendar-todo-item-badge" />;
  }

  return null;
}

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelect = date => {
    setSelectedDate(date);
  };

  const list = getTodoList(selectedDate);

  return (
    <HStack spacing={10} style={{ height: 320 }} alignItems="flex-start" wrap>
      <Calendar compact renderCell={renderCell} onSelect={handleSelect} style={{ width: 320 }} />
      {list.length ? (
        <List style={{ flex: 1 }} bordered>
          {list.map(item => (
            <List.Item key={item.time} index={item.time}>
              <div>{item.time}</div>
              <div>{item.title}</div>
            </List.Item>
          ))}
        </List>
      ) : null}
    </HStack>
  );
};

// Use createRoot to render your application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
