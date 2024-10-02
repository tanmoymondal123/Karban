import React from 'react';
import '../style/Ticket.css'; // Import the CSS file
import highPriorityIcon from '../icons/Img - High Priority.svg'
import mediumPriorityIcon from '../icons/Img - Medium Priority.svg'
import lowPriorityIcon from '../icons/Img - Low Priority.svg'
import urgent from '../icons/Img - Low Priority.svg'

const Ticket = ({ ticket }) => {
  const showIcon = () => {
    switch (ticket.priority) {
      case 0:
        return <img src={lowPriorityIcon} alt="Low Priority" className="priority-icon" />;
      case 1:
        return <img src={lowPriorityIcon} alt="Low Priority" className="priority-icon" />;
      case 2:
        return <img src={mediumPriorityIcon} alt="Medium Priority" className="priority-icon" />;
      case 3:
        return <img src={mediumPriorityIcon} alt="Medium Priority" className="priority-icon" />;
      case 4:
        return <img src={highPriorityIcon} alt="High Priority" className="priority-icon" />;
      default:
        return null; // No icon for undefined or invalid priority
    }
  };
  return (
    <div className="ticket-card">
      <p>{ticket.id}</p>
      <p id='title'>{ticket.title}</p>
      <div className='mini-container'>
        <div className='priority'>
        {showIcon()} 
        </div>
        <div className='tag'>
          {ticket.tag}
        </div>
      </div>
    </div>
  );
};

export default Ticket;