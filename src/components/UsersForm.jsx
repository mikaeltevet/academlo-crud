import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock, faCake } from '@fortawesome/free-solid-svg-icons'
import './UsersForm.css';

const UsersForm = ({ user, onSave, onCancel }) => {
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(user ? user.first_name : '');
  const [lastName, setLastName] = useState(user ? user.last_name : '');
  const [birthday, setBirthday] = useState(user ? user.birthday : '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      birthday
    };
    if(user){
        await axios.put(`https://users-crud.academlo.tech/users/${user.id}`, userData)
        .then(response => {
            console.log(response.data);
            onSave(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }else{
        axios.post('https://users-crud.academlo.tech/users/', userData)
        .then(response => {
            console.log(response.data);
            onSave(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }
  };

  return (
    <div>
        <h2>New User</h2>
    <form onSubmit={handleSubmit} className="users-form">
    <div className="form-group">
        <div className="icon-container">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <input type="text" placeholder="First Name" className="form-control" value={firstName} onChange={event => setFirstName(event.target.value)}/>
        <input type="text" placeholder="Last Name" className="form-control" value={lastName} onChange={event => setLastName(event.target.value)}/>
      </div>
      <div className="form-group">
        <div className="icon-container">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <input type="email" placeholder="Email" className="form-control" value={email} onChange={event => setEmail(event.target.value)}/>
      </div>
      <div className="form-group">
        <div className="icon-container">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <input type="password" placeholder="Password" className="form-control" value={password} onChange={event => setPassword(event.target.value)}/>
      </div>
      <div className="form-group">
        <div className="icon-container">
          <FontAwesomeIcon icon={faCake} />
        </div>
        <input type="date" placeholder="Birthday" className="form-control date" value={birthday} onChange={event => setBirthday(event.target.value)}/>
      </div>
      <button type="submit">Upload</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
    </div>
  );
};

export default UsersForm;