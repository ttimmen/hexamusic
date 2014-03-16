$(document).ready(function() {

  var socket = io.connect('10.100.1.156:3000');
  socket.emit('join', 'scherm' );
  socket.on('projectie', function (data) {
    //console.log(data['projectie'])
    //console.log(data['projectie'][7]);
    //u.getUnity().SendMessage("MAINSCRIPT","SetScaleX",data['projectie'][0]/110);
    //u.getUnity().SendMessage("MAINSCRIPT","SetScaleY",data['projectie'][1]/130);
    //u.getUnity().SendMessage("MAINSCRIPT","SetScaleZ",data['projectie'][2]/120);
    //u.getUnity().SendMessage("MAINSCRIPT","SetSpacingX",data['projectie'][3]/50);
    //u.getUnity().SendMessage("MAINSCRIPT","SetSpacingY",data['projectie'][4]/66);
    //u.getUnity().SendMessage("MAINSCRIPT","SetCubesX",data['projectie'][5]/1);
    //u.getUnity().SendMessage("MAINSCRIPT","SetCubesY",data['projectie'][6]/1);
    //u.getUnity().SendMessage("MAINSCRIPT","SetColor",data['projectie'][7]);
    u.getUnity().SendMessage("MAINSCRIPT", "Beat", "");
    console.log('beat');
  });

  socket.on('ctrl', function(data){
    u.getUnity().SendMessage("MAINSCRIPT", "SetColor", data['bgcolor']);
    console.log(data['bgcolor']);
  });

  socket.on('twitter', function(data){
    console.log(data.msg);
    u.getUnity().SendMessage("MAINSCRIPT", "SetTag", data.msg.tag);
    u.getUnity().SendMessage("MAINSCRIPT", "SetTagValue", data.msg.count);
  });

  socket.on('leap', function(data){
    //console.log(data.msg);
    u.getUnity().SendMessage("MAINSCRIPT", "SetRotateX",data.msg.palm[2]/10);
    u.getUnity().SendMessage("MAINSCRIPT", "SetRotateY",data.msg.palm[2]/10);
  })
});
