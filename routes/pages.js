var express = require('express');
var router = express.Router();
//var NodeCache = require('node-cache');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var settings = require('../settings');

//var cache = new NodeCache();

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'monitor@nickwhiteley.com',
        pass: 'k1p00f#ssoaauyan555ksu88sa?'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
function sendMail(subject, body, callback) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'contact@seethespark.com', // sender address
        to: 'contact@seethespark.com', // list of receivers
        subject: subject, // Subject line
        text: body//, // plaintext body
        //html: '<b>Hello world ✔</b>' // html body
    };
        //console.log(transporter);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (err, info) {
        //console.log(mailOptions);
        if (err) {
            callback(err, undefined);
            //logError('sendMail', err);
        } else {
            callback(undefined, 'Received');
        }
    });
}

/** Home page */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Nick Whiteley :: Home'
    });
});

/** Get a list of image type files and create an array and send them */
router.get('/images', function (req, res) {
    fs.readdir(path.join(__dirname, '../public/photos'), function(err, files) {
        if (err) { return next(err); }
        var i, fileExtension, retVal = [];
        for(i = 0; i < files.length; i++) {
            fileExtension = files[i].split('.').pop();
            fileExtension = fileExtension.toLowerCase();
            if (fileExtension === 'gif' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
                retVal.push({src: files[i]});
            }
        }
        res.send(retVal);
    });
});

/** Not used but can be modified for a new page */
router.get('/sales-map', function (req, res) {

    res.render('salesmap', {
        title: 'See The Spark :: Sales Map',
        subHeading: 'Sales Map'
    });
});

/** Privacy and cookie policy */
router.get('/privacy', function (req, res) {
    res.render('privacy', {
        title: 'See The Spark :: Privacy and Cookies',
        subHeading: 'Privacy and Cookies'
    });
});

router.get('/brew', function (req, res) {
   res.render('brew', { title: 'Overton home brewing',
       css: '/css/brew.css'
   });
});

/** Allows for sending of emails */
router.post('/message', function (req, res) {
    var body;
    if (req.headers.referer.indexOf('://localhost:300') > 6 &&
        req.headers.referer.indexOf('://localhost:300') > -1 &&
        req.headers.referer.indexOf('://www.seethespark.com') > 6 &&
        req.headers.referer.indexOf('://www.seethespark.com') > -1) {
    //if (req.headers.referer !== 'https://www.seethespark.com/' && req.headers.referer !== 'http://www.seethespark.com/' && req.headers.referer !== 'http://localhost:3000/' && req.headers.referer !== 'https://localhost:3001/') {
        res.status(403).send('Disallowed referrer.');
        return;
    }
    if (req.body.senderName === '' || req.body.senderName === undefined ||
            req.body.email === '' || req.body.email === undefined ||
            req.body.message === '' || req.body.message === undefined) {
        res.status(403).send('Required fields missing.');
        return;
    }
    body = 'From: ' + req.body.senderName + '\nEmail: ' + req.body.email + '\nMessage: ' + req.body.message + '\n';
    sendMail('seethespark.com contact', body, function (err, resp) {
        if (err) {
            res.send(err.message);
        } else {
            res.send(resp);
        }
    });
});

module.exports = router;
