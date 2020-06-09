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
import {
    updateData
} from './updateSetting';
const loginBtn = document.querySelector('#login');
const logoutBtn = document.querySelector('#logout');
const mapBox = document.getElementById('map')
const saveBtn = document.querySelector('#saveUserData');
const passwordBtn = document.querySelector('#savePassword');
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

if (saveBtn) {
    saveBtn.addEventListener('click', event => {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        event.preventDefault();
        updateData({
            name,
            email
        }, 'data');
    });
}
if (passwordBtn) {
    passwordBtn.addEventListener('click', event => {
        const passwwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;
        event.preventDefault();
        updateData({
            passwwordCurrent,
            password,
            confirmPassword
        }, 'password');
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirms').value = '';
    });
}