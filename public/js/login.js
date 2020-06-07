// const axios = require('axios');

const checkLogin = async (email, password) => {
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
        console.log(res);
    } catch (error) {
        console.log(error.response.data);
    }
    // next();
}
document.querySelector('.btn').addEventListener('click', event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
        return alert('Enter both email and password');
    }
    checkLogin(email, password);
})