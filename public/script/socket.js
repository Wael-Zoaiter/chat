$(function(){
    var socket = io();
    var sendSec = $('.send-section input');
//    var groupy = $('.active').prop('id');
    var user = prompt('Enter Your name:');
    
    $('form').on('submit', function(e){
        e.preventDefault();
        socket.emit('createMessage',user, sendSec.val(), function(data){
            console.log('The message from you ' + data + ' successfully received.');
        });
        sendSec.val('');
        return false;
    });
    socket.on('newMessage', function(data) {
        $('.msgs').append($('<li>').text(data.from+': '+data.text).addClass('message'));
//        var group = io('/' + groupy);
//    group.on(group + '_msg',function(msg){
//        // make a chat section to group 1
//        $('#' + group).next('.nofic').fadeIn(500);
//        console.log(group + ': ' + msg);
//    });
    });
    socket.on('newLocationMessage',function(data){
        $('.msgs').append($('<a target="_blank">').attr('href',data.url).text('My Location').addClass('message'));
    });
    
    var locationButton = $('.send-location');
    locationButton.on('click', function(){
        if(!navigator.geolocation) {
            return alert('Geolocation not supported by yout browser.');
        }
        
        locationButton.attr('disabled','disabled').text('...');
        navigator.geolocation.getCurrentPosition(function (position){
            locationButton.removeAttr('disabled').text('Send Location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, function(){
                
                alert('Unable to fetch location.');
            });
        })
    });
});