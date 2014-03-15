$(document).ready(function() {

  var socket = io.connect('10.100.1.101:3000');
  socket.on('projectie', function (data) {
    //console.log(data['projectie'])
    //console.log(data['projectie'][7]);
    u.getUnity().SendMessage("MAINSCRIPT","SetScaleX",data['projectie'][0]/110);
    u.getUnity().SendMessage("MAINSCRIPT","SetScaleY",data['projectie'][1]/130);
    u.getUnity().SendMessage("MAINSCRIPT","SetScaleZ",data['projectie'][2]/120);
    u.getUnity().SendMessage("MAINSCRIPT","SetSpacingX",data['projectie'][3]/50);
    u.getUnity().SendMessage("MAINSCRIPT","SetSpacingY",data['projectie'][4]/66);
    //u.getUnity().SendMessage("MAINSCRIPT","SetCubesX",data['projectie'][5]/1);
    //u.getUnity().SendMessage("MAINSCRIPT","SetCubesY",data['projectie'][6]/1);
    u.getUnity().SendMessage("MAINSCRIPT","SetColor",data['projectie'][7]);
    u.getUnity().SendMessage("MAINSCRIPT", "Beat", "");
  });

});
