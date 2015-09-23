/// ERROR CODE A01
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var settings  = require('./settings.js');
var pages = require('./routes/pages');

var app = express();

app.use(compression({ flush: require('zlib').Z_SYNC_FLUSH }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());

app.use('/', pages);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            err.code = err.code || 'G01001';
            console.log(err);
            //logger.error(req, 'app.errorHandler', err.code, err, 2);
            res.status(err.status || 500);
            //console.log(req.headers);
            if (req.headers.accept === 'application/json' || req.headers['x-requested-with'] === 'XMLHttpRequest') {
                res.send({error: err.message});
            } else {
                res.render('error', {
                    message: err.message,
                    error: err
                });
            }
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        err.code = err.code || 'G01002';
            console.log(err);
        //logger.error(req, 'app.errorHandler', err.code, err, 2);
        res.status(err.status || 500);
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.send(err.message);
        } else {
            res.render('error', {
                message: err.message,
                error: {}
            });
        }
    });

module.exports = app;
