;(function() {
"use strict";

var MESSAGE_INIT = 'INIT',
    MESSAGE_HALOGEN = 'HALOGEN',
    MESSAGE_LED = 'LED',
    MESSAGE_PANIC = 'PANIC';

var visType = 'fancy'; // 'fast' or 'fancy'

var socket = io();
socket.on('connect', function () {
    console.log('connected!');
    $('#connected').addClass('connected');

});
socket.on('disconnect', function(){
    $('#connected').removeClass('connected');
});

socket.on('message', function (message) {
    switch (message.type) {
        case MESSAGE_INIT:
            console.log('initialized');
            break;
        case MESSAGE_HALOGEN:
            $('#halogen').text(message.value);
            break;
        case MESSAGE_LED:
            //$('#led').text(message.value);
            applyLedItems(message.value, visType);
            break;
        case MESSAGE_PANIC:
            $('#error').text('PANIC!');
            break;
    }
});
console.log('Socket.io initialized!');

// initialize the led items
$(document).ready(function(){
    console.log('initializing DOM');
    for(var i = 0; i < 120; i++){
        $('#led').append('<div class="led-item"></div>');
    }

    // set the visType
    $('#led').addClass('vis-type-' + visType);
});

/**
 *
 * @param values
 * @param visType - visualisation type, can be 'fast' or 'fancy'
 */
function applyLedItems(values, visType){
    var color, cssVal;
    var ledChildren = $('#led')[0].children;
    console.assert(ledChildren.length === values.length);
    //console.log('ledChildren', ledChildren);

    for(var i = 0; i < values.length; i++){
        if(visType === 'fast'){
            color = 'rgb(' + values[i].join(',') + ')';
            $(ledChildren[i]).css('background-color', color);
        } else if(visType === 'fancy'){
            color = 'rgb(' + values[i].join(',') + ')';
            cssVal = 'radial-gradient(ellipse farthest-side, '+ color + ', rgba(0,0,0,0)';//;
            $(ledChildren[i]).css('background-image', cssVal);
        }
    }
}
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4vYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTUVTU0FHRV9JTklUID0gJ0lOSVQnLFxuICAgIE1FU1NBR0VfSEFMT0dFTiA9ICdIQUxPR0VOJyxcbiAgICBNRVNTQUdFX0xFRCA9ICdMRUQnLFxuICAgIE1FU1NBR0VfUEFOSUMgPSAnUEFOSUMnO1xuXG52YXIgdmlzVHlwZSA9ICdmYW5jeSc7IC8vICdmYXN0JyBvciAnZmFuY3knXG5cbnZhciBzb2NrZXQgPSBpbygpO1xuc29ja2V0Lm9uKCdjb25uZWN0JywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdjb25uZWN0ZWQhJyk7XG4gICAgJCgnI2Nvbm5lY3RlZCcpLmFkZENsYXNzKCdjb25uZWN0ZWQnKTtcblxufSk7XG5zb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCBmdW5jdGlvbigpe1xuICAgICQoJyNjb25uZWN0ZWQnKS5yZW1vdmVDbGFzcygnY29ubmVjdGVkJyk7XG59KTtcblxuc29ja2V0Lm9uKCdtZXNzYWdlJywgZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlIE1FU1NBR0VfSU5JVDpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXplZCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTUVTU0FHRV9IQUxPR0VOOlxuICAgICAgICAgICAgJCgnI2hhbG9nZW4nKS50ZXh0KG1lc3NhZ2UudmFsdWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgTUVTU0FHRV9MRUQ6XG4gICAgICAgICAgICAvLyQoJyNsZWQnKS50ZXh0KG1lc3NhZ2UudmFsdWUpO1xuICAgICAgICAgICAgYXBwbHlMZWRJdGVtcyhtZXNzYWdlLnZhbHVlLCB2aXNUeXBlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIE1FU1NBR0VfUEFOSUM6XG4gICAgICAgICAgICAkKCcjZXJyb3InKS50ZXh0KCdQQU5JQyEnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuY29uc29sZS5sb2coJ1NvY2tldC5pbyBpbml0aWFsaXplZCEnKTtcblxuLy8gaW5pdGlhbGl6ZSB0aGUgbGVkIGl0ZW1zXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdpbml0aWFsaXppbmcgRE9NJyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IDEyMDsgaSsrKXtcbiAgICAgICAgJCgnI2xlZCcpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImxlZC1pdGVtXCI+PC9kaXY+Jyk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHRoZSB2aXNUeXBlXG4gICAgJCgnI2xlZCcpLmFkZENsYXNzKCd2aXMtdHlwZS0nICsgdmlzVHlwZSk7XG59KTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHZhbHVlc1xuICogQHBhcmFtIHZpc1R5cGUgLSB2aXN1YWxpc2F0aW9uIHR5cGUsIGNhbiBiZSAnZmFzdCcgb3IgJ2ZhbmN5J1xuICovXG5mdW5jdGlvbiBhcHBseUxlZEl0ZW1zKHZhbHVlcywgdmlzVHlwZSl7XG4gICAgdmFyIGNvbG9yLCBjc3NWYWw7XG4gICAgdmFyIGxlZENoaWxkcmVuID0gJCgnI2xlZCcpWzBdLmNoaWxkcmVuO1xuICAgIGNvbnNvbGUuYXNzZXJ0KGxlZENoaWxkcmVuLmxlbmd0aCA9PT0gdmFsdWVzLmxlbmd0aCk7XG4gICAgLy9jb25zb2xlLmxvZygnbGVkQ2hpbGRyZW4nLCBsZWRDaGlsZHJlbik7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgaWYodmlzVHlwZSA9PT0gJ2Zhc3QnKXtcbiAgICAgICAgICAgIGNvbG9yID0gJ3JnYignICsgdmFsdWVzW2ldLmpvaW4oJywnKSArICcpJztcbiAgICAgICAgICAgICQobGVkQ2hpbGRyZW5baV0pLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKTtcbiAgICAgICAgfSBlbHNlIGlmKHZpc1R5cGUgPT09ICdmYW5jeScpe1xuICAgICAgICAgICAgY29sb3IgPSAncmdiKCcgKyB2YWx1ZXNbaV0uam9pbignLCcpICsgJyknO1xuICAgICAgICAgICAgY3NzVmFsID0gJ3JhZGlhbC1ncmFkaWVudChlbGxpcHNlIGZhcnRoZXN0LXNpZGUsICcrIGNvbG9yICsgJywgcmdiYSgwLDAsMCwwKSc7Ly87XG4gICAgICAgICAgICAkKGxlZENoaWxkcmVuW2ldKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCBjc3NWYWwpO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==
