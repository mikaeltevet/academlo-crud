import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faLock, faCake } from '@fortawesome/free-solid-svg-icons'
import './UsersForm.css';
import { ClipLoader } from 'react-spinners';

const UsersForm = ({ user, onSave, onCancel }) => {
    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState(user ? user.password : '');
    const [firstName, setFirstName] = useState(user ? user.first_name : '');
    const [lastName, setLastName] = useState(user ? user.last_name : '');
    const [birthday, setBirthday] = useState(user ? user.birthday : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState(user ? user.id : '');

    useEffect(() => {
        setEmail(user ? user.email : '');
        setPassword(user ? user.password : '');
        setFirstName(user ? user.first_name : '');
        setLastName(user ? user.last_name : '');
        setBirthday(user ? user.birthday : '');
        setUserId(user ? user.id : '');
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const userData = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        birthday
        };
        if(user){
            await axios.put(`https://users-crud.academlo.tech/users/${userId}/`, userData)
            .then(response => {
                onSave(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        }else{
            axios.post('https://users-crud.academlo.tech/users/', userData)
            .then(response => {
                onSave(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        }
        setIsSubmitting(false);
    };

    return (
        <div>
            {isEditing ? <h2>Edit User</h2> : <h2>New User</h2>}
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
                    <input type="date" placeholder="Birthday" className="form-control" value={birthday} onChange={event => setBirthday(event.target.value)}/>
                </div>
                <div className="form-group">
                    {isSubmitting ? (
                        <ClipLoader color="#2196F3" size={40} loading={isSubmitting} />
                    ) : (
                        <>
                            <button type="submit" className="form-control submit-button">Save</button>
                            <button type="button" className="form-control cancel-button" onClick={() => onCancel()}>Cancel</button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

export default UsersForm;