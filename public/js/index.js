import '@babel/polyfill';
import {
    checkLogin,
    logout
} from './login';
import {
    displayMap
} from './mapBox';
import {
    showAlert
} from './alert';

const loginBtn = document.querySelector('.btn');
const logoutBtn = document.querySelector('#logout');
const mapBox = document.getElementById('map')

if (mapBox) {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
    displayMap(locations);
}


if (loginBtn) {
    loginBtn.addEventListener('click', event => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            return showAlert('error', 'Enter both email and password');
        }
        checkLogin(email, password);
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', event => {
        logout();
    });
}