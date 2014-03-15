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
    // Initialise the color picker
    $('#color').chromoselector({
        target: '#picker',
        autoshow: true,
        width: 200,
        preview: false,
        create: updatePreview,
        update: updatePreview
    }).chromoselector('show', 1);

  var socket = io.connect('http://node.thevoice.vtm.be/');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

});
