import axios from 'axios';
import {
    showAlert
} from './alert';

//type is either 'password' or 'data'
export const updateData = async (data, type) => {
    try {

        const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updatePassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if (res.data.status === 'successfully') {
            setTimeout(() => {
                showAlert('success', 'updated out');
            }, 2000);

        }

    } catch (error) {
        console.log(error);
        showAlert('error', error.message);
    }
}