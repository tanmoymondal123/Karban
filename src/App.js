import React, { useState, useEffect } from 'react';
import './App.css';
import DefaultUserIcon from './icons/menu.svg';
import NoPriorityIcon from './icons/No-priority.svg';
import LowPriorityIcon from './icons/Img - Low Priority.svg';
import MediumPriorityIcon from './icons/Img - Medium Priority.svg';
import HighPriorityIcon from './icons/Img - High Priority.svg';
import UrgentPriorityIcon from './icons/SVG - Urgent Priority colour.svg';
import TodoIcon from './icons/To-do.svg'; // Using this as Feature Request icon
import InProgressIcon from './icons/in-progress.svg';
import DoneIcon from './icons/Done.svg';
import CanceledIcon from './icons/Cancelled.svg';
import BacklogIcon from './icons/Backlog.svg';
import DisplayIcon from './icons/Display.svg'; //  display icon
import PlusIcon from './icons/add.svg'; // Plus icon for beside the user names
import ThreeDotsIcon from './icons/menu.svg'; // Three dots for beside user names

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grouping, setGrouping] = useState('Status');
  const [ordering, setOrdering] = useState('Priority');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
        setLoading(false); // Data loaded, stop showing the loader
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to toggle popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handler for changing grouping
  const handleGroupingChange = (e) => {
    setGrouping(e.target.value);
  };

  // Handler for changing ordering
  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
  };

  // Function to map statuses to icons
  const getStatusIcon = (status) => {
    const statusIconMap = {
      "Todo": <img src={TodoIcon} alt="Todo" />,
      "In Progress": <img src={InProgressIcon} alt="In Progress" />,
      "Done": <img src={DoneIcon} alt="Done" />,
      "Canceled": <img src={CanceledIcon} alt="Canceled" />,
      "Backlog": <img src={BacklogIcon} alt="Backlog" />
    };
    return statusIconMap[status] || null;
  };

  // Function to map priorities to icons
  const getPriorityIcon = (priority) => {
    const priorityIconMap = {
      0: <img src={NoPriorityIcon} alt="No Priority" />,
      1: <img src={LowPriorityIcon} alt="Low Priority" />,
      2: <img src={MediumPriorityIcon} alt="Medium Priority" />,
      3: <img src={HighPriorityIcon} alt="High Priority" />,
      4: <img src={UrgentPriorityIcon} alt="Urgent Priority" />
    };
    return priorityIconMap[priority] || null;
  };

  // Function to map user IDs to icons
  const getUserIcon = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? <img src={DefaultUserIcon} alt={user.name} title={user.name} /> : null;
  };

  // Group tickets by Status, Users, or Priority
  const groupTickets = () => {
    const grouped = {};

    if (grouping === 'Status') {
      grouped.Backlog = [];
      grouped.Todo = [];
      grouped['In Progress'] = [];
      grouped.Done = [];
      grouped.Canceled = [];

      tickets.forEach(ticket => {
        const status = ticket.status;
        if (grouped[status]) {
          grouped[status].push(ticket);
        }
      });
    } else if (grouping === 'User') {
      users.forEach(user => {
        grouped[user.name] = [];
      });

      tickets.forEach(ticket => {
        const user = users.find(u => u.id === ticket.userId);
        const userName = user ? user.name : 'Unknown';
        if (!grouped[userName]) {
          grouped[userName] = [];
        }
        grouped[userName].push(ticket);
      });
    } else if (grouping === 'Priority') {
      grouped['No Priority'] = [];
      grouped.Low = [];
      grouped.Medium = [];
      grouped.High = [];
      grouped.Urgent = [];

      tickets.forEach(ticket => {
        switch (ticket.priority) {
          case 0:
            grouped['No Priority'].push(ticket);
            break;
          case 1:
            grouped.Low.push(ticket);
            break;
          case 2:
            grouped.Medium.push(ticket);
            break;
          case 3:
            grouped.High.push(ticket);
            break;
          case 4:
            grouped.Urgent.push(ticket);
            break;
          default:
            break;
        }
      });
    }

    return grouped;
  };

  // Get grouped tickets based on selected grouping
  const groupedTickets = groupTickets();

  return (
    <div className="board-container">
      <header className="board-header">
        <button className="display-button" onClick={togglePopup}>
          <img src={DisplayIcon} alt="Display" /> Display
        </button>

        {/* Popup for Grouping and Ordering */}
        {isPopupOpen && (
          <div className="popup-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="popup-content">
              <h3>Grouping & Ordering</h3>
              <div className="grouping">
                <label htmlFor="grouping">Grouping:</label>
                <select id="grouping" value={grouping} onChange={handleGroupingChange}>
                  <option value="Status">Status</option>
                  <option value="User">User</option>
                  <option value="Priority">Priority</option>
                </select>
              </div>
              <div className="ordering">
                <label htmlFor="ordering">Ordering:</label>
                <select id="ordering" value={ordering} onChange={handleOrderingChange}>
                  <option value="Priority">Priority</option>
                  <option value="Title">Title</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="columns-container">
          {Object.keys(groupedTickets).map(group => (
            <div key={group} className="column">
              <h2>
                {getStatusIcon(group)} {group} ({groupedTickets[group].length})
              </h2>
              {groupedTickets[group].map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">{ticket.id}</span>
                    <span className="ticket-priority">{getPriorityIcon(ticket.priority)}</span>
                  </div>
                  <h4>{ticket.title}</h4>
                  <div className="ticket-details">
                    <span className="ticket-tag">
                      {getPriorityIcon(ticket.priority)} {/* Priority on the left side */}
                      <img src={TodoIcon} alt="Feature Request" /> {/* Feature Request Icon */}
                      {ticket.tag && ticket.tag.length > 0 ? ticket.tag[0] : 'No Tag'}
                    </span>
                    <div className="ticket-user">
                      {getUserIcon(ticket.userId)}
                    </div>
                  </div>
                  <div className="ticket-actions">
                    <img src={PlusIcon} alt="Add" className="ticket-add" />
                    <img src={ThreeDotsIcon} alt="Menu" className="ticket-menu" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
