var opacity = 1;
var lastColor;

$(document).ready(function() {
    localStorage.setItem('hosturl', location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''));
    var socket = io.connect( localStorage.getItem('hosturl') );
    socket.emit('join', 'app' );

    var oldHue = 0;

    setInterval(function(){
      if (opacity > 0){
        opacity -= 0.05;
        //$("#color").css('opacity:'+opacity+';');
        $('.color').css({
            'opacity': opacity
        });
        //var c = pusher.color(lastColor);
        //$("#color").css("background-color:");
        //console.log(opacity);
      }
      //console.log("test");
    },20);


    // This function will be run when the color of the
    // input element needs to be changed
    /*var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.getHexString(),
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
        $(this).html('');
        socket.emit('color',  { my: color.getTextColor().getHexString() } );

    };*/
    var updateBackground = function(bgcolor){
        $('.color').css({
            'background-color': bgcolor,
        });
        $('.color').css({
            'background-color': bgcolor,
        });
    }


    // Initialise the color picker


  socket.on('ctrl', function (data) {
    updateBackground(data.bgcolor);
    lastColor = data.bgcolor;

  });
   socket.on('midi', function (data) {
    console.log(data);
    opacity = 1;
    //$("#color").css('opacity:'+opacity+';');
    //animatieBg();
  });

   var animatieBg = function() {
      $(".color").animate({ "opacity": "-=0.1" }, "slow" );
  };


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

  $( ".zones .btn" ).click(function() {
     var item_id = $(this).attr('href').replace('#','');
    localStorage.setItem('zones', item_id);
    showbase();
  });

  /*$("#admin-interface").mousemove(function(e){
    var $width = ($(document).width())/255;
    var $height = ($(document).height())/255;
    var $pageX = parseInt(e.pageX / $width,10);
    var $pageY = parseInt(e.pageY / $height,10);
    console.log($pageY);
    $("#admin-interface").css("background-color", "rgb("+$pageY+",0,"+$pageY+")");
  });*/

  $('#admin-interface').bind('touchmove',function(e){
      e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var elm = $(this).offset();
      var x = touch.pageX - elm.left;
      var y = touch.pageY - elm.top;
      if(x < $(this).width() && x > 0){
          if(y < $(this).height() && y > 0){
                  //CODE GOES HERE
                  //console.log(touch.pageY+' '+touch.pageX);
                  var hue = (touch.pageY / $("#admin-interface").height())*360;
                  if (hue > 60){
                    var c = pusher.color("#88FF88").hue(hue).hex6();
                    //console.log("hue:"+hue);
                    $("#admin-interface").css("background-color", c);
                    //socket.emit('color',  { my: color.getTextColor().getHexString() } );
                    if (Math.abs(oldHue - hue) > 2 && hue > 60){
                      socket.emit('color',  { my: c } );
                    }
                    oldHue = hue;
                  }

          }
      }
  });


});
