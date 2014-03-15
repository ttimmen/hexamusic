$(document).ready(function() {
    localStorage.setItem('hosturl', '10.100.1.101:3000');
    var socket = io.connect( localStorage.getItem('hosturl') );

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

    // Initialise the color picker
    $('#choice').chromoselector({
        target: '#picker',
        autoshow: true,
        width: $('#choice').width(),
        preview: false,
        create: updatePreview,
        update: updatePreview
    }).chromoselector('show', 1);


  socket.on('ctrl', function (data) {
    updateBackground(data.bgcolor);
  });
  socket.on('admin', function (data) {
    showAdmin();
  });

  var showbase = function(){
   $('#color').show();
   $('#admin-interface').hide();

  }

  var showAdmin = function(){
     $('#color').hide();
     $('#admin-interface').show();
  }

  var showZones = function(){
     $('#color').hide();
     $('#admin-interface').show();
  }


});
