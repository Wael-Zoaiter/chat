var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var date = require('moment')();

var routes = require('./routes/index');
var {generateMessage, generateLocationMessage} = require('./utils/message.js');
var {isRealString} = require('./utils/validation.js');
var {Users} = require('./utils/users');

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
var users = new Users();

io.on('connection',function(socket) {
    var theDate = date.format('h:mm a');
    
    console.log('User Connected at ' + theDate);
    
    socket.on('join', function(params,callback) {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Room is required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));


        socket.emit('newMessage',generateMessage('Admin','Welcome'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has connected.`));
        
        socket.on('createMessage',function(sender, msg, callback) {
            if (msg.trim() != ''){
                console.log(sender + ': ' + msg);
                io.to(params.room).emit('newMessage', generateMessage(sender,msg));
                callback(sender);
            }
        });
    
        socket.on('createLocationMessage', function(coords){
            io.to(params.room).emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        });
        
        socket.on('disconnect', function() {
            var user = users.removeUser(socket.id);
            if(user) {
                io.to(user.room).emit('updateUserList', users.getUserList(user.room));
                io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            }
        });

        callback();

    });

});

// Listen to Server
var port = process.env.PORT || 3000;

http.listen(port,function() {
	console.log('listening on port '+port);
});

module.exports = app;