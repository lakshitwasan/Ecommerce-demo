const express = require('express');
const router = express.Router();
const request = require('request');
const jsSHA = require('jssha');
const { v4: uuid } = require('uuid');
const { isLoggedIn } = require('../middleware');
const Order = require('../models/order');



router.post('/payment_gateway/payumoney',isLoggedIn,(req, res) => {
    
    req.body.txnid = uuid();
    req.body.email = req.user.email;
    req.body.firstname = req.user.username;
    const pay = req.body;
    
    const hashString =  ' YOUR_MERCHANT_KEY'
                        + '|' + pay.txnid
                        + '|' + pay.amount 
                        + '|' + pay.productinfo 
                        + '|' + pay.firstname 
                        + '|' + pay.email 
                        + '|' + '||||||||||'
                        + 'YOUR_MERCHANT_SALT' 
    
    const sha = new jsSHA('SHA-512', "TEXT");
    
    sha.update(hashString);
    const hash = sha.getHash("HEX");
    
    pay.key =   ' YOUR_MERCHANT_KEY' //store in in different file;
    pay.surl = 'http://localhost:1000/payment/success';
    pay.furl = 'http://localhost:1000/payment/fail';
    pay.hash = hash;
    
    request.post({
    
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        url: 'https://sandboxsecure.payu.in/_payment', //Testing url
        form: pay
    
    }, function (error, httpRes, body) {
        if (error) 
            res.send(
                {
                    status: false,
                    message:error.toString()
                });
        
           if(res.statusCode===200) {
            res.send(body);
        }
        else if (httpRes.statusCode >= 300 && httpRes.statusCode <= 400) {
            res.redirect(httpRes.headers.location.toString());
        }
    })
});

router.post('/payment/success',isLoggedIn, async(req, res) => {
    
    const { txnid, productinfo, amount } = req.body;

    const user = req.user;


    const order = new Order({txnid,productinfo,amount,orderedProducts:[...user.cart]})
    
    user.orders.push(order);

    await order.save();

    user.cart.splice(0, req.user.cart.length);

    req.user = await user.save();

    res.redirect('/user/myorders');
})


router.post('/payment/fail',isLoggedIn, (req, res) => {
   
    req.flash('error',`Oops! Can't place your order at the moment.Please try again after some time!`)
    res.redirect('/user/cart');
})









module.exports = router;