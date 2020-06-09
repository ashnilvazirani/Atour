import axios from 'axios';
import {
    showAlert
} from './alert';

//type is either 'password' or 'data'
export const updateData = async (data, type) => {
    try {
        var url = '';
        url += type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updatePassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
        console.log(url);
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if (res.data.status === 'successfully') {
            showAlert('success', 'updated out');
            setTimeout(() => {
                location.assign('/me')
            }, 1000);
        }

    } catch (error) {
        showAlert('error', 'Something went wrong' + error.message);
    }
}