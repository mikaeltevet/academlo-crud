import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCake, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import './UsersForm.css';

const UsersForm = ({ user, onSave, onCancel, users, setUsers }) => {
    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState(user ? user.password : '');
    const [firstName, setFirstName] = useState(user ? user.first_name : '');
    const [lastName, setLastName] = useState(user ? user.last_name : '');
    const [birthday, setBirthday] = useState(user ? user.birthday : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState(user ? user.id : '');
    const [isEditing, setIsEditing] = useState(user ? true : false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        setEmail(user ? user.email : '');
        setPassword(user ? user.password : '');
        setFirstName(user ? user.first_name : '');
        setLastName(user ? user.last_name : '');
        setBirthday(user ? user.birthday : '');
        setUserId(user ? user.id : '');
    }, [user]);
    
    useEffect(() => {
        if (success) {
            setTimeout(() => setSuccess(false), 2000);
        }
    }, [success]);
    
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
        try {
            if (isEditing) {
                // update user
                await axios.put(`https://users-crud.academlo.tech/users/${userId}/`, userData);
                setSuccess(true);
            } else {
                // create user
                await axios.post('https://users-crud.academlo.tech/users/', userData);
                setSuccess(true);
            }
            // update list of users
            onSave(userData);
            const fetchUsers = async () => {
                const response = await axios.get('https://users-crud.academlo.tech/users/');
                setUsers(response.data);
            }
            fetchUsers();
            setIsSubmitting(false);
            handleCancel();
        } catch (error) {
            setErrors(error.message);
            setIsSubmitting(false);
        }
    };    
    
    const handleCancel = () => {
        onCancel();
        };
              
        
        return (
        <div>
        {isEditing ? <h2>Edit User</h2> : <h2>New User</h2>}
        {errors && <div className="error-message">{errors}</div>}
        {success && <div className="success-message">Successfully saved user</div>}
        <form onSubmit={handleSubmit} className="users-form">
        <div className="form-group">
        <div className="icon-container">
        <FontAwesomeIcon icon={faUser} />
        </div>
        <input
        type="text"
        placeholder="First Name"
        className="form-control"
        value={firstName}
        onChange={event => setFirstName(event.target.value)}
        />
        <input
        type="text"
        placeholder="Last Name"
        className="form-control"
        value={lastName}
        onChange={event => setLastName(event.target.value)}
        />
        </div>
        <div className="form-group">
        <div className="icon-container">
        <FontAwesomeIcon icon={faEnvelope} />
        </div>
        <input
        type="email"
        placeholder="Email"
        className="form-control"
        value={email}
        onChange={event => setEmail(event.target.value)}
        />
        </div>
        <div className="form-group">
        <div className="icon-container">
        <FontAwesomeIcon icon={faLock} />
        </div>
        <input
        type="password"
        placeholder="Password"
        className="form-control"
        value={password}
        onChange={event => setPassword(event.target.value)}
        />
        </div>
        <div className="form-group">
        <div className="icon-container">
        <FontAwesomeIcon icon={faCake} />
        </div>
        <input
        type="date"
        placeholder="Birthday"
        className="form-control"
        value={birthday}
        onChange={event => setBirthday(event.target.value)}
        />
        </div>
        <div className="form-group">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : isEditing ? 'Save' : 'Create'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
</div>
</form>
</div>
);
};

UsersForm.propTypes = {
user: PropTypes.shape({
email: PropTypes.string,
password: PropTypes.string,
first_name: PropTypes.string,
last_name: PropTypes.string,
birthday: PropTypes.string,
id: PropTypes.number
}),
onSave: PropTypes.func.isRequired,
onCancel: PropTypes.func.isRequired,
setUsers: PropTypes.func.isRequired
};

UsersForm.defaultProps = {
user: null
};

export default UsersForm;