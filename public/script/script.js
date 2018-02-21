$(function(){
    $('.groups-list li').on('click',function(){
        $('.groups-list').children('li').removeClass('active');
        $(this).addClass('active');
        $('.nofic').fadeOut(500);
    });
});