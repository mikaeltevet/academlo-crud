import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersForm from './UsersForm';
import styled from 'styled-components';
import './UsersList.css';

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

const UsersList = ({ users, onEdit, onDelete }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                const response = await axios.get('https://users-crud.academlo.tech/users/');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setErrors(error.message);
                setLoading(false);
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
        setEditingUser(users.find(user => user.id === userId));
        setIsEditing(true);
    }

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`https://users-crud.academlo.tech/users/${userId}/`);
            setUsers(users.filter(user => user.id !== userId));
            setSuccess(true);
        } catch (error) {
            setErrors(error.message);
        }
    }

    const saveUser = async (userData) => {
        if (isEditing) {
            try {
                await axios.put(`https://users-crud.academlo.tech/users/${userData.id}/`, userData);
                setUsers(users.map(user => (user.id === userData.id ? userData : user)));
                setIsEditing(false);
                setSuccess(true);
            } catch (error) {
                setErrors(error.message);
            }
        } else {
            try {
                await axios.post('https://users-crud.academlo.tech/users/', userData);
                setUsers([...users, userData]);
                setSuccess(true);
            } catch (error) {
                setErrors(error.message);
            }
        }
    }

    const cancelEdition = () => {
        setIsEditing(false);
        setEditingUser(null);
    }

    return (
        <div>
            {errors && <ErrorMessage>{errors}</ErrorMessage>}
            {loading && <div>Loading...</div>}
            {success && <SuccessMessage>User was created/edited successfully</SuccessMessage>}
            {editingUser ? (
                <UsersForm user={editingUser} isEditing={isEditing} onSave={saveUser} onCancel={cancelEdition}/>
            ) : (
                users.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthdate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.first_name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.birthday}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user.id)}>Edit</button>
                                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    : <div>No users found</div>
            )}
        </div>
    )
}

export default UsersList;