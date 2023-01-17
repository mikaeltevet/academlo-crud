import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersForm from './UsersForm';
import './UsersList.css';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get('https://users-crud.academlo.tech/users')
        .then(response => {
          setUsers(response.data);
          setLoading(false);
        })
        .catch(error => {
          setErrors(error.message);
          setLoading(false);
        });
    }, []);
  
    function createUser() {
        setEditingUser({});
    }

    return (
        <div>
          {errors && <div>{errors}</div>}
          {loading && <div>Loading...</div>}
          {editingUser ? (
            <UsersForm user={editingUser} onSave={saveUser} onCancel={cancelEdition}/>
          ) : (
            <div>
            <button className="createuser" onClick={createUser}>Create User</button>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Birthday</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.birthday}</td>
                  <td>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                    <button onClick={() => editUser(user)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    );

    function deleteUser(id) {
        axios.delete(`https://users-crud.academlo.tech/users/${id}`)
        .then(()=>{
            //update the state to remove the user from the list
            setUsers(users.filter(user => user.id !== id))
        }).catch(error => {
            setErrors(error.message);
        });
      }
    
      function editUser(user) {
        setEditingUser(user);
      }
    
      function saveUser(user) {
        if(user.id) {
          axios.put(`https://users-crud.academlo.tech/users/${user.id}`, user)
          .then(()=>{
            setUsers(users.map(u => {
              if (u.id === user.id) {
                return user;
              }
              return u;
            }));
            setEditingUser(null);
          }).catch(error => {
            setErrors(error.message);
          });
      } else {
        axios.post(`https://users-crud.academlo.tech/users`, user)
          .then(response => {
            setUsers([...users, response.data]);
            setEditingUser(null);
          }).catch(error => {
            setErrors(error.message);
          });
      }
    }
    
    function cancelEdition(){
      setEditingUser(null);
    }
};

export default UsersList;    