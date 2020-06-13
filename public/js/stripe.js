// import axios from 'axios';
const axios = require('axios');
exports.bookTour = async (tourID) => {
    const stripe = Stripe('pk_test_51GtCLnGNc1zDDy2h72oDu8J6CTqn89ryEvpmk6AqNDo8hlIkErLcAHo2mxR0e87gPMNndjMQH0EexF7Tg4pfsNUi00NNbzPlHi')
    try {
        const session = await axios({
            method: 'GET',
            url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
        });
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (error) {
        console.log(error);
    }
}