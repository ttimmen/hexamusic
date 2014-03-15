$(document).ready(function() {
    // This function will be run when the color of the
    // input element needs to be changed
    var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.getHexString(),
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
        $(this).html('');

    };
    var updateBackground = function(bgcolor){
        $('#color').css({
            'background-color': bgcolor,
        });

    }

    console.log($('#color').width());
    // Initialise the color picker
    $('#color').chromoselector({
        target: '#picker',
        autoshow: true,
        width: $('#color').width(),
        preview: false,
        create: updatePreview,
        update: updatePreview
    }).chromoselector('show', 1);

  var socket = io.connect('10.100.1.101:3000');
  socket.on('ctrl', function (data) {
    //console.log(data);
    //console.log(data.bgcolor)
    updateBackground(data.bgcolor);

    //console.log(json.bgcolor);
    //console.log(json);
   socket.emit('my other event', { my: 'data' });
  });

});
