var TestMapLoader = Class.create(MapLoader,{
  load: function(map){

    var map_data = [
      [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
      [0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,0,1,1,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    for(var i = 0; i < map_data.length; i++){
      for(var j = 0; j < map_data[i].length; j++){
        
        if(!map.data[i]) map.data[i] = [];
        
        if(map_data[i][j]){
          map.data[i][j] = new SolidMapBlock(map,i,j);
          
          /*
          var character = new Character(map,'sprite');
          character.x = i;
          character.y = j;
          map.characters.push(character);
          */
          
        }else{
          map.data[i][j] = new EmptyMapBlock(map,i,j);
        }
        
      }
    }
    
    map.data[3][3].drawable_callback = function(canvas,x,y,renderer){
      canvas.fillStyle = 'rgba(255,64,64,0.5)';
      canvas.fillRect(x,y,15,15);
    };
    
    var character = new Character(map,'sprite');
    character.x = 2;
    character.y = 2;
    map.characters.push(character);
    /*
    var character = new Character(map,'sprite');
    character.x = 3;
    character.y = 8;
    map.characters.push(character);
    */
  }
});