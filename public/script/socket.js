$(function(){
    var socket = io();
//        var groupy = $('.active').prop('id');
    
    $('form').submit(function(){
        socket.emit('createMessage','group', $('.send-section input').val());
        $('.send-section input').val('');
        return false;
    });
    socket.on('newMessage', function(data) {                $('.msgs').append($('<li>').text(data.from+': '+data.text).addClass('message'));
//        var group = io('/' + groupy);
//    group.on(group + '_msg',function(msg){
//        // make a chat section to group 1
//        $('#' + group).next('.nofic').fadeIn(500);
//        console.log(group + ': ' + msg);
//    });
    });
});