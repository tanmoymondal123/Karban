import React, { useState } from 'react';

const TaskBoard = ({ tickets = [], users = [] }) => { // Default values for tickets and users
  const [grouping, setGrouping] = useState('Status');  // default grouping by status
  const [ordering, setOrdering] = useState('Priority'); // default ordering by priority

  // Grouping tickets based on the selected criteria (Status, User, or Priority)
  const groupTickets = () => {
    if (grouping === 'Status') {
      return groupBy(tickets, 'status');
    } else if (grouping === 'User') {
      return groupBy(tickets, 'userId', users);
    } else if (grouping === 'Priority') {
      return groupBy(tickets, 'priority');
    }
  };

  // Grouping function
  const groupBy = (tickets = [], key, users = []) => { // Ensure tickets and users are arrays
    if (key === 'userId') {
      return tickets.reduce((result, ticket) => {
        const user = users.find((u) => u.id === ticket[key]);
        const userName = user ? user.name : 'Unassigned';
        if (!result[userName]) result[userName] = [];
        result[userName].push(ticket);
        return result;
      }, {});
    }
    return tickets.reduce((result, ticket) => {
      if (!result[ticket[key]]) result[ticket[key]] = [];
      result[ticket[key]].push(ticket);
      return result;
    }, {});
  };

  // Ordering function
  const sortTickets = (ticketsGroup = []) => { // Ensure ticketsGroup is an array
    if (ordering === 'Priority') {
      return ticketsGroup.sort((a, b) => b.priority - a.priority);
    } else if (ordering === 'Title') {
      return ticketsGroup.sort((a, b) => a.title.localeCompare(b.title));
    }
    return ticketsGroup;
  };

  const groupedTickets = groupTickets();

  return (
    <div>
      {/* Display Button with Dropdown for Grouping and Ordering */}
      <div className="display-menu">
        <button className="display-button">Display</button>
        <div className="dropdown-menu">
          <div className="grouping">
            <label>Grouping:</label>
            <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
              <option value="Status">Status</option>
              <option value="User">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
          <div className="ordering">
            <label>Ordering:</label>
            <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Render grouped and ordered tickets */}
      <div className="ticket-board">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="ticket-group">
            <h3>{group}</h3>
            <div className="tickets">
              {sortTickets(groupedTickets[group]).map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <h4>{ticket.title}</h4>
                  <p>Status: {ticket.status}</p>
                  <p>Priority: {ticket.priority}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
