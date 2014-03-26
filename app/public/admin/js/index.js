$(document).ready(function() {
    localStorage.setItem('hosturl', location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''));
    var socket = io.connect( localStorage.getItem('hosturl') );
    socket.emit('join', 'admin' );


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
        socket.emit('color',  { my: color.getTextColor().getHexString() } );
    };
    var updateBackground = function(bgcolor){
        $('#color').css({
            'background-color': bgcolor,
        });
    }

    // Initialise the color picker


  socket.on('ctrl', function (data) {
    updateBackground(data.bgcolor);

  });

  socket.on('admin', function (data) {
    console.log(data);
    if(data.active == 1){
      showAdmin();
    }
    else{
      showbase();
    }
  });

  socket.on('alert', function (data) {
  });

  var showbase = function(){
   $('#base').show();
   $('#admin-interface').hide();
   $('.zones').hide();
  }
  var showAdmin = function(){
     $('#base').hide();
     $('#admin-interface').show();
     $('.zones').hide();
  }
  var showZones = function(){
     $('#base').hide();
     $('.zones').visible();
     $('#admin-interface').show();
  }

  // click events
  $( ".zones .col-xs-6 .thumbnail" ).click(function() {
     var item_id = $(this).attr('href').replace('#','');
    localStorage.setItem('zones', item_id);
    showbase();
  });




});
