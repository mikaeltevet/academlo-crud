import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock, faCake } from '@fortawesome/free-solid-svg-icons'
import './UsersForm.css';

const UsersForm = ({ user, onSave, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      birthday
    };
    let userExist = await axios.get(`https://users-crud.academlo.tech/users?email=${user.email}/`);
    if(userExist.data.length){
        await axios.put(`https://users-crud.academlo.tech/users/${userExist.data[0].id}/`, user)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }else{
        axios.post('https://users-crud.academlo.tech/users/', user)
        .then(response => {
            console.log(response.data);
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