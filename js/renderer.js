var Renderer = Class.create({
  
  initialize: function(canvas,options){
    options = options || {};
    
    this.target_fps = 12;
    this.blit_timer = null;
    this.canvas = canvas;
    
    this.angle = 0;
    
    this.map = null;
    this.map_render_data = {
      offset_x: 480,
      offset_y: 360,
      scale_x:  1.0,
      scale_y:  1.0
    };
    
    this.sprites_path = 'images/';
    this.sprites = {};
  },
  
  //TODO: See if keeping sprites as native canvas elements is faster?
  load_sprite: function(name,callback){
    this.sprites[name] = new Image;
    this.sprites[name].onload = callback || function(){};
    this.sprites[name].src = this.sprites_path + name + '.png';
  },
    
  draw_background: function(){
    this.canvas.clearRect(0,0,960,640);
  },
  
  //TODO: need to ensure we're drawing front to back in terms of viewport
  //TODO: occulusion, viewport cropping
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
      
      var x = coords.x;
      var y = coords.y;
      
      if(character.selected){
        this.canvas.drawImage(this.sprites.selected_shadow,x,y);
      }
      
      x += character.sprite.offset_x;
      y += character.sprite.offset_y;
      
      this.canvas.drawImage(this.sprites[character.sprite.name],x,y);
    }
  },
  
  //TODO: Make it so it only blits when game state has changed?
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
  
  rotate_camera: function(angle){
    if(angle >= 0){
      this.angle += 90;
    }else{
      this.angle -= 90;
    }
    
    if(this.angle >= 360){
      this.angle = 0;
    }else if(this.angle < 0){
      this.angle = 270;
    }
    
    this.update_map_render_data_from_angle();
    this.blit();
  },
  
  
  
  map2canvas: function(map_x,map_y){
    var x = (map_x - map_y) *  this.map.tile.height     ;
    var y = (map_x + map_y) * (this.map.tile.height / 2);
    
    x *= this.map_render_data.scale_x;
    y *= this.map_render_data.scale_y;
    
    x += this.map_render_data.offset_x;
    y += this.map_render_data.offset_y;
    
    return {x: x, y: y};
  },
  
  update_map_render_data_from_angle: function(){
    switch(this.angle){
      case 90:
        this.map_render_data.scale_x = -1.0;
        this.map_render_data.scale_y = 1.0;
        break;
      case 180:
        this.map_render_data.scale_x = -1.0;
        this.map_render_data.scale_y = -1.0;
        break;
      case 270:
        this.map_render_data.scale_x = 1.0;
        this.map_render_data.scale_y = -1.0;
        break;
      case 0:
      default:
        this.map_render_data.scale_x = 1.0;
        this.map_render_data.scale_y = 1.0;
        break;
    }
  }
  
});