$(function(){
    var socket = io();
    var sendSec = $('.send-section input');
//    var groupy = $('.active').prop('id');
//    var user = prompt('Enter Your name:');
    
    function scrollToBottom() {
        var messages = $('.msgs');
        var newMessage = messages.children('li:last-child');
        var lastMessage = newMessage.prev();
        var clientHeight = messages.prop('clientHeight');
        var scrollHeight = messages.prop('scrollHeight');
        var scrollTop = messages.prop('scrollTop');
        var newMessageScroll = newMessage.innerHeight();
        var lastMessageScroll = lastMessage.innerHeight();
        
        if (clientHeight + scrollTop + newMessageScroll + lastMessageScroll >= scrollHeight) {
            messages.scrollTop(scrollHeight);
        }
    }
    
    socket.on('connect', function(){
        var params = jQuery.deparam(window.location.search);

        socket.emit('join', params, function(err){
            if (err) {
                alert(err);
                window.location.href = '/';
            } else {
                console.log('No Error');
            }
        });
        
        $('form').on('submit', function(e){
        e.preventDefault();
        socket.emit('createMessage',params.name, sendSec.val(), function(data){
            console.log(`The message from you ${data} successfully received.`);
        });
        sendSec.val('');
        return false;
    });
    });
    
    socket.on('disconnect', function(){
        console.log('Disconnected from server');
    });

    socket.on('updateUserList', function(users){
        console.log('Users list: ', users);
        var ul = jQuery('<ul class="list-unstyled"></ul>');

        users.forEach(function(user){
            ul.append(jQuery('<li></li>').text(user));
        });

        jQuery('.groups-list').html(ul);
    });
    
    socket.on('newMessage', function(data) {
        var formattedTime = moment(data.createdAt).format('h:mm a');
        var template = $('#message-template').html();
        var html = Mustache.render(template,{
            text: data.text,
            from: data.from,
            createdAt: formattedTime
        });
        $('.msgs').append(html);
        scrollToBottom();
    });
    
    socket.on('newLocationMessage',function(data){
        var formattedTime = moment(data.createdAt).format('h:mm a');
        var template = $('#location-template').html();
        var html = Mustache.render(template,{
            url: data.url,
            from: data.from,
            createdAt: formattedTime
        });
        $('.msgs').append(html);
        scrollToBottom();
    });
    
    var locationButton = $('.send-location');
    
    locationButton.on('click', function(){
        if(!navigator.geolocation) {
            return alert('Geolocation not supported by your browser.');
        }
        locationButton.attr('disabled','disabled').text('...');
        navigator.geolocation.getCurrentPosition(function (position){
            locationButton.removeAttr('disabled').html('<i class="fa fa-location-arrow"></i>');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, function(){
                
                alert('Unable to fetch location.');
            });
        });
    });
    
//    --
});