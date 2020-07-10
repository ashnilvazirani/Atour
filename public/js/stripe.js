// import axios from 'axios';
const axios = require('axios');
// var {
//     showAlert
// } = require('./alert');
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

exports.checkTourAvailability = async (data) => {
    try {
        const result = await axios({
            method: 'POST',
            url: `/api/v1/bookings/checkAvailable`,
            data
        });
        // console.log(result.data.status);
        if (result.data.status === 'success') {
            // console.log('booking the tour')
            // showAlert('success', 'Going ahead to make payment...');
            this.bookTour(data.tourID);

        } else if (result.data.status === 'fail') {
            // console.log('failed to book');
            showAlert('error', 'Cannot book this tour for you');
        }
    } catch (error) {
        console.log(error);
    }
}