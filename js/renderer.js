var Renderer = Class.create({
  
  initialize: function(canvas,options){
    options = options || {};
    
    this.target_fps = 24;
    this.blit_timer = null;
    this.canvas = canvas;
    
    this.map = null;
    this.map_render_data = {
      offset_x: 480,
      offset_y: 360,
      scale_x:  1.0,
      scale_y: -1.0
    };
    
    this.sprites_path = 'images/';
    this.sprites = {};
  },
  
  load_sprite: function(name,callback){
    this.sprites[name] = new Image;
    this.sprites[name].onload = callback || function(){};
    this.sprites[name].src = this.sprites_path + name + '.png';
  },
    
  draw_background: function(){
    this.canvas.clearRect(0,0,960,480);
  },
  
  draw_map: function(){
    for(var i = 0; i < this.map.data.length; i++){
      for(var j = 0; j < this.map.data[i].length; j++){
        var map_value = this.map.data[i][j];
        if(map_value){
          var map_coords = this.map2canvas(i,j);
          this.canvas.drawImage(this.sprites.ground,map_coords.x,map_coords.y);
        }
      }
    }
  },
  
  draw_characters: function(){
    for(var i = 0; i < this.map.characters.length; i++){
      var character = this.map.characters[i];
      var coords = this.map2canvas(character.x,character.y);
      
      var x = coords.x + character.sprite.offset_x;
      var y = coords.y + character.sprite.offset_y;
      
      this.canvas.drawImage(this.sprites[character.sprite.name],x,y);
    }
  },
  
  blit: function(){
    this.draw_background();
    this.draw_map();
    this.draw_characters();
  },
  
  initialize_blit: function(){
    this.blit_timer = setInterval(this.blit.bind(this),this.target_framerate_for_timer());
  },
  
  target_framerate_for_timer: function(){
    return 1000 / this.target_fps;
  },
  
  
  
  map2canvas: function(map_x,map_y){
    var x = (map_x - map_y) *  this.map.tile.height     ;
    var y = (map_x + map_y) * (this.map.tile.height / 2);
    
    x *= this.map_render_data.scale_x;
    y *= this.map_render_data.scale_y;
    
    x += this.map_render_data.offset_x;
    y += this.map_render_data.offset_y;
    
    return {x: x, y: y};
  }
  
});