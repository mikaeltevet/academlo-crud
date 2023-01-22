import React, { useState, useEffect } from 'react';
import UsersForm from './components//UsersForm';
import UsersList from './components/UsersList';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
        const response = await axios.get('https://users-crud.academlo.tech/users/');
        setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleSave = async (userData) => {
    if (userData.id) {
        const updatedUsers = users.map((user) => {
            if (user.id === userData.id) {
                return userData;
            }
            return user;
        });
        setUsers(updatedUsers);
        setSelectedUser(null);
    } else {
        setUsers([...users, userData]);
        setSelectedUser(null);
    }
    const handleEdit = async (userData) => {
      const updatedUsers = users.map((user) => {
          if (user.id === userData.id) {
              return userData;
          }
          return user;
      });
      setUsers(updatedUsers);
      setSelectedUser(null);
    }
  }
  
  const handleDelete = async (userId) => {
      try {
          await axios.delete(`https://users-crud.academlo.tech/users/${userId}/`);
          setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
          console.error(error);
      }
  }
  
  const handleCancel = () => {
      setSelectedUser(null);
  }
  
  return (
      <div>
          { selectedUser ? 
              <UsersForm user={selectedUser} onSave={handleEdit} onCancel={handleCancel} />
              :
              <div>
                  {users.length > 0 ? <UsersList users={users} onEdit={setSelectedUser} onDelete={handleDelete} onSave={handleSave} /> : <UsersForm onSave={handleSave} />}
              </div>
          }
      </div>
  );
};

export default App;