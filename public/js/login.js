// const axios = require('axios');
import axios from 'axios';
import {
    showAlert
} from './alert';
export const checkLogin = async (email, password) => {
    try {

        console.log(email, password);
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
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
            url: 'http://127.0.0.1:3000/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            showAlert('success', 'logged out');
            location.reload(true);
            if (location.href == '/tour') {
                location.href("/")
            }
        }
    } catch (error) {
        showAlert('error', 'logout failed');
    }
}