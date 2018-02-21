$(function(){
    var socket = io();
        var group = $('.active').prop('id');
    
    $('form').submit(function(){
        
        var group = io('/' + group);
    group.on(group + '_msg',function(msg){
        // make a chat section to group 1
        $('#' + group).next('.nofic').fadeIn(500);
        console.log(group + ': ' + msg);
    });
        
        socket.emit('message',group, $('.send-section input').val());
        $('.send-section input').val('');
        return false;
    });
    socket.on('res msg', function(data) {                $('.msgs').append($('<li>').text(data.from+': '+data.message).addClass('message'));
    });
});