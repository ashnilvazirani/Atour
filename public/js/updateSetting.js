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
            url = 'http://127.0.0.1:3000/api/v1/users/updatePassword';
            method = 'PATCH';
        } else if (type === 'data') {
            url = 'http://127.0.0.1:3000/api/v1/users/updateMe';
            method = 'PATCH';
        } else if (type === 'review') {
            url = 'http://127.0.0.1:3000/api/v1/reviews';
            method = 'POST';
        }
        console.log(url, method);
        const res = await axios({
            method,
            url,
            data
        });
        if (res.data.status === 'successfully') {
            setTimeout(() => {
                showAlert('success', 'updated out');
            }, 2000);
            location.reload();
        }

    } catch (error) {
        console.log(error);
        showAlert('error', error.message);
    }
}