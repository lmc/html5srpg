var Renderer = Class.create({
  
  initialize: function(canvas,effects_canvas,options){
    options = options || {};
    
    this.target_fps = 15;
    this.blit_timer = null;
    
    this.canvases = {
      main:    canvas,
      effects: effects_canvas
    }
    this.canvas = this.canvases.main;
    
    this.angle = 270;
    
    this.effects = [];
    this.selected_effect = null;
    this.selected_coordinates = [null,null];
    
    this.camera_focus_target = null; //OR {x: world_pos, y: world_pos}
    
    this.map = null;
    
    this.canvas_size = {
      width:  960,
      height: 640
    };
    
    this.map_render_data = {
      offset_x: 480,
      offset_y: 360,
      scale_x:  1.0,
      scale_y:  -1.0
    };
    
    this.sprites_path = 'images/';
    this.sprites = {};
  },
  
  //TODO: See if keeping sprites as native canvas elements is faster?
  load_sprite: function(name,callback){
    this.sprites[name] = new Image;
    this.sprites[name].onload = callback || function(){};
    this.sprites[name].src = this.sprites_path + name + '.png';
    return this.sprites[name];
  },
  
  create_effect: function(){
    var effect = new Effect(this);
    this.effects.push(effect);
    return effect;
  },
  
  before_blit: function(){
    if(this.camera_focus_target){
      this.focus_camera(this.camera_focus_target.x,this.camera_focus_target.y);
      this.camera_focus_target = null;
    }
  },
    
  draw_background: function(){
    this.canvas.clearRect(0,0,960,640);
  },
  
  //TODO: occulusion, viewport cropping
  draw_map: function(){
    if(this.angle == 90){
      for(var i = 0; i < this.map.data.length; i++){
        for(var j = 0; j < this.map.data[i].length; j++){
          this.draw_map_tile(i,j);
        }
      }
    }else if(this.angle == 180){
      for(var i = this.map.data.length - 1; i > 0; i--){
        for(var j = 0; j < this.map.data[i].length; j++){
          this.draw_map_tile(i,j);
        }
      }
    }else if(this.angle == 270){
      for(var i = 0; i < this.map.data.length; i++){
        for(var j = this.map.data[i].length - 1; j > 0; j--){
          this.draw_map_tile(i,j);
        }
      }
    }else{
      for(var i = this.map.data.length - 1; i > 0; i--){
        for(var j = this.map.data[i].length - 1; j > 0; j--){
          this.draw_map_tile(i,j);
        }
      }
    }
  },
  
  draw_map_tile: function(map_x,map_y){
    var map_value = this.map.data[map_x][map_y];
    var map_coords = this.map2canvas(map_x,map_y);
    if(map_value.drawable()){
      this.canvas.drawImage(this.sprites.ground,map_coords.x,map_coords.y);
    }
    //TODO: BENCHMARK: Faster to run a blank function, or check for valid function and run if possible?
    //if(map_value.drawable_callback){
      map_value.drawable_callback(this.canvas,map_coords.x,map_coords.y,this);
    //}
    //if(this.selected_coordinates[0] == map_x && this.selected_coordinates[1] == map_y){
    //  this.canvas.drawImage(this.sprites.selected_shadow,map_coords.x,map_coords.y);
    //}
  },
  
  draw_characters: function(){
    for(var i = 0; i < this.map.characters.length; i++){
      var character = this.map.characters[i];
      var coords = this.map2canvas(character.x,character.y);
      
      var x = coords.x;
      var y = coords.y;
      
      if(character.selected){
        this.canvas.drawImage(this.sprites.selected_shadow,x,y);
        this.draw_selected_effect(character);
      }
      
      x += character.sprite.offset_x;
      y += character.sprite.offset_y;
      
      this.canvas.drawImage(this.sprites[character.sprite.name],x,y);
    }
  },
  
  draw_selected_effect: function(character){
    if(!this.selected_effect){
      this.selected_effect = this.create_effect();
      this.selected_effect.sprite = this.load_sprite('particle');
    }
    this.selected_effect.set_origin(character);
    
    this.canvases.effects.clearRect(0,0,960,640);
    this.selected_effect.blit(this.canvases.effects);
  },
  
  //TODO: Make it so it only blits when game state has changed?
  blit: function(){
    this.before_blit();
    this.draw_background();
    this.draw_map();
    this.draw_characters();
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
  },
  
  focus_camera: function(x,y,scroll_time){
    var to_offset = this.map2canvas(x,y);
    
    this.map_render_data.offset_x -= to_offset.x;
    this.map_render_data.offset_y -= to_offset.y;
    
    this.map_render_data.offset_x += (this.canvas_size.width / 2);
    this.map_render_data.offset_y += (this.canvas_size.height / 2);
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