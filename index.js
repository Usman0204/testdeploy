// server.js
const express = require('express');
const app = express();

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

 

// console.log(sgMail);

 

app.use(cors());
app.use(logger('dev'));
//use body parser urlencoded to parse encoded body
app.use(bodyParser.urlencoded({
        extended: true
}));

 

//use body parser json to parse json body
app.use(bodyParser.json({
        limit: '500kb'
}));



const forceSSL = function() {
        return function(req, res, next) {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                return res.redirect(
                    ['https://', req.get('Host'), req.url].join('')
                );
            }
            next();
        }
    }
    // Instruct the app
    // to use the forceSSL
    // middleware
    //app.use(forceSSL());
app.get('/health', async function(req, res) {
    res.status(200).send("api okay");

});


app.post('/api/contactUS', async function (req, res) {
    try {
        let msg = {
            to: 'soheila@terrascale.org',
            from: 'alee@terrascale.org',
            subject: `Contact US`,
            text: `Contact Us Email`,
            html: `<strong>Name:  ${req.body.name}<strong> <br>
                   <strong>Email:</strong>  ${req.body.email} <br>
                   <strong>Description:  <strong>${req.body.message}`
        };
        await sgMail.send(msg);
        res.send({ status: true, msg: 'Email has been sent successfully. Our representative will contact you shortly.' })
    } catch (error) {
        console.log(error)
        res.send({ status: false, msg: error.message })
    }
});
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
const path = require('path');
// ...
// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});
// Start the app by listening on the default
// Heroku port
//app.listen(process.env.PORT || 3001);
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
