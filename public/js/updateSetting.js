import axios from 'axios';
import {
    showAlert
} from './alert';

//type is either 'password' or 'data'
export const updateData = async (data, type) => {
    try {
        var url = "";
        var method = "";
        if (type === 'password') {
            url = '/api/v1/users/updatePassword';
            method = 'PATCH';
        } else if (type === 'data') {
            url = '/api/v1/users/updateMe';
            method = 'PATCH';
        } else if (type === 'review') {
            url = '/api/v1/reviews';
            method = 'POST';
        } else if (type === 'signup') {
            // url = 'http://127.0.0.1:3000/api/v1/users/signup';
            url = '/api/v1/users/signup';
            method = 'POST';
        }
        // console.log(url, method);
        const res = await axios({
            method,
            url,
            data
        });
        if (res.data.status === 'successfully') {
            setTimeout(() => {
                showAlert('success', 'Completed your desired task');
            }, 2000);
            location.reload();
            if (type === "signup") {
                location.href = "/me";
            }
        }

    } catch (error) {
        console.log(error);
        showAlert('error', error.message);
    }
}