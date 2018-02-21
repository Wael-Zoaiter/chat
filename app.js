var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var routes = require('./routes/index');

// view engine setup
//app.set('public', path.join(__dirname, 'public'));
//app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);




/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Socket.io Section
io.on('connection',function(socket) {
    console.log('User Connected');
    socket.on('createMessage',function(sender,msg) {
        console.log(sender + ': ' + msg);
        io.emit('newMessage',{
            from: sender,
            message: msg
        });
    });
});

//var group_1 = io.of('/group_1');
//group_1.on('connection',function(socket) {
//    socket.emit('group_1_msg',{
//        sendto: '/group_1'
//    });
//});

// Listen to Server
var port = process.env.PORT || 3000;
http.listen(port,function() {
	console.log('listening on port '+port);
});

module.exports = app;