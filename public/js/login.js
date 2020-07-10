// const axios = require('axios');
import {
    showAlert
} from './alert';
import axios from 'axios';
export const checkLogin = async (email, password) => {
    try {

        console.log(email, password);
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'successfully') {
            setTimeout(() => {
                location.assign('/')
            }, 1000);
            showAlert('success', 'Login successful');
        }
    } catch (error) {
        showAlert('error', 'Invalid Login credentials');

    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            showAlert('success', 'logged out');
            setTimeout(() => {
                location.assign('/')
            }, 1000);
            if (location.href == '/tour') {
                location.href("/")
            }
        }
    } catch (error) {
        showAlert('error', 'logout failed');
    }
}