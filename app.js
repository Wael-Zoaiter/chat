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
var users = require('./routes/user');



app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);


// Socket.io Section
io.on('connection',function(socket){
    console.log('User Connected');
    socket.on('message',function(sender,msg){
        console.log(sender + ': ' + msg);
        io.emit('res msg',{
            from: sender,
            message: msg
        });
    });
});

var group_1 = io.of('/group_1');
group_1.on('connection',function(socket){
    socket.emit('group_1_msg',{
        sendto: '/group_1'
    });
});


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

// Listen to Server
http.listen(3000,function(){
	console.log('listening on port 3000');
});

module.exports = app;