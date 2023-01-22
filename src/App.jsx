import React, { useState, useEffect } from 'react';
import UsersForm from './components//UsersForm';
import UsersList from './components/UsersList';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
        const response = await axios.get('https://users-crud.academlo.tech/users');
        setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const handleSave = async (userData) => {
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

  const handleDelete = async (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  }

  const handleCancel = () => {
    setSelectedUser(null);
  }

  return (
    <div>
      { selectedUser ? 
          <UsersForm user={selectedUser} onSave={handleEdit} onCancel={handleCancel}/>
          :
          <>
            {users.length > 0 ? <UsersList users={users} onEdit={setSelectedUser} onDelete={handleDelete} /> : <UsersForm onSave={handleSave} onCancel={handleCancel} />}
          </>
      }
    </div>
)
}

export default App;