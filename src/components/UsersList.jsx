import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersForm from './UsersForm';
import styled from 'styled-components';
import './UsersList.css';
import PropTypes from 'prop-types';

const SuccessMessage = styled.div`
    color: green;
    font-size: 18px;
    margin-bottom: 16px;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 18px;
    margin-bottom: 16px;
`;

const UsersList = ({ users: usersFromProps, setUsers }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://users-crud.academlo.tech/users/');
                setUsers(response.data);
            } catch (error) {
                setErrors(error.message);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        if(success) {
            setTimeout(() => setSuccess(false), 2000);
        }
    }, [success])

    const handleEdit = (userId) => {
        setEditingUser(usersFromProps.find(user => user.id === userId));
        setIsEditing(true);
    }

    const handleDelete = async (userId) => {
        setIsDeleting(true);
        try {
            await axios.delete(`https://users-crud.academlo.tech/users/${userId}/`);
            setUsers(usersFromProps ? usersFromProps.filter(user => user.id !== userId) : []);
            setSuccess(true);
        } catch (error) {
            setErrors(error.message);
        }
        setIsDeleting(false);
    }

    const saveUser = async (userData) => {
        if (isEditing) {
                await axios.put(`https://users-crud.academlo.tech/users/${userData.id}/`, userData);
                // update the state of the users list with the updated user
                setIsEditing(false);
                setSuccess(true);
        } else {
            try {
                await axios.post('https://users-crud.academlo.tech/users/', userData);
                setSuccess(true);
                const newUsers = await axios.get('https://users-crud.academlo.tech/users/');
                setUsers(newUsers);
            } catch (error) {
                setErrors(error.message);
            }
        }
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditingUser(null);
    };
    
    const handleNewUser = () => {
        setIsEditing(false);
        setEditingUser({});
    }

    return (
        <div>
            {errors && <ErrorMessage>{errors}</ErrorMessage>}
            {loading && <div>Loading...</div>}
            {success && <SuccessMessage>User was created/edited successfully</SuccessMessage>}
            <button onClick={handleNewUser}>Create User</button>
            {isEditing ? (
                <UsersForm user={editingUser} onSave={saveUser} onCancel={handleCancel} setUsers={setUsers} />
            ) : (
                usersFromProps.length > 0 ? (
                    <div className="users-list">
                        {usersFromProps.map((user) => (
                            <div key={user.id} className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                                    <p className="card-text">{user.email}</p>
                                    <p className="card-text">{user.birthday}</p>
                                    <div className="card-footer">
                                        <button className="btn btn-primary" onClick={() => handleEdit(user.id)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No users to display</div>
                )
            )}
        </div>
    );
    };

UsersList.propTypes = {
    users: PropTypes.array.isRequired,
    setUsers: PropTypes.func.isRequired,
};

export default UsersList;