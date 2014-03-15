$(document).ready(function() {

  var socket = io.connect('10.100.1.101:3000');
  socket.on('ctrl', function (data) {
    u.getUnity().SendMessage("MAINSCRIPT", "Beat", "");
  });

});
