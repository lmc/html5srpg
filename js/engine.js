var Engine = Class.create({
  initialize: function(canvas,effects_canvas,map_loader_instance){
    this.map = null;
    this.renderer = null;
    
    this.prng_seed = 0;
    
    this.think_framerate = 60;
    this.renderer_framerate = 15;
    this.think_timer = null;
    this.renderer_timer = null;
    
    this.initialize_map(map_loader_instance);
    this.initialize_renderer(canvas,effects_canvas);
    this.initialize_controls();
    
    //ensure we have someone selected at init
    this.selected_character_index = -1;
    this.cycle_selected_character();
    
    this.selected_coordinates = [null,null];
  },
  
  initialize_map: function(map_loader_instance){
    this.map = new Map();
    map_loader_instance.load(this.map);
  },
  
  initialize_renderer: function(canvas,effects_canvas){
    this.renderer = new Renderer(canvas.getContext('2d'),effects_canvas.getContext('2d'));
    this.renderer.map = this.map;
    
    this.renderer.load_sprite('ground');
    this.renderer.load_sprite('selected_shadow');
    this.renderer.map.characters.each(function(character){
      this.renderer.load_sprite(character.sprite.name);
    },this);
  },
  
  initialize_controls: function(){
    Event.observe(window,'keydown',function(event){
      var key = String.fromCharCode(event.keyCode);
      switch(key){
        case 'W': this.get_selected_character().controller_input({x:  0, y:  1}); break;
        case 'S': this.get_selected_character().controller_input({x:  0, y: -1}); break;
        case 'A': this.get_selected_character().controller_input({x: -1, y:  0}); break;
        case 'D': this.get_selected_character().controller_input({x:  1, y:  0}); break;
        
        case 'L': this.cycle_selected_character(); break;
        
        case 'O': this.renderer.rotate_camera( 1); break;
        case 'P': this.renderer.rotate_camera(-1); break;
      }
    }.bind(this));
    
    Event.observe(window,'mousemove',function(event){
      var x = event.clientX;
      var y = event.clientY;
      
      x -= this.renderer.map_render_data.offset_x;
      y -= this.renderer.map_render_data.offset_y;
      
      x *= this.renderer.map_render_data.scale_x;
      y *= this.renderer.map_render_data.scale_y;
      
      //midpoints
      //x += (this.renderer.map.tile.width  / 2);
      //y += (this.renderer.map.tile.height / 2);
      
      x /= this.renderer.map.tile.width;
      y /= this.renderer.map.tile.height;
      
      //factor in camera rotation
      
      x = parseInt(x);
      y = parseInt(y);
      
      this.selected_coordinates = [x,y];
      this.renderer.selected_coordinates = [x,y];
      
      $('output').innerHTML = "Translated: "+x+","+y;
    }.bind(this));
  },
  
  initialize_think: function(){
    this.think_timer    = setInterval(this.think.bind(this),1000 / this.think_framerate);
    this.renderer_timer = setInterval(this.renderer_think.bind(this),1000 / this.renderer_framerate);
  },
  
  think: function(){
    
  },
  
  renderer_think: function(){
    var selected_character = this.get_selected_character();
    this.renderer.focus_camera(selected_character.x,selected_character.y);
    
    this.renderer.blit();
  },
  
  get_selected_character: function(){
    return this.map.characters[this.selected_character_index];
  },
  
  set_selected_character: function(new_selected_character_index){
    var character;
    if(character = this.get_selected_character()){
      character.selected = false;
    }
    this.selected_character_index = new_selected_character_index;
    character = this.get_selected_character()
    character.selected = true;
  },
  
  cycle_selected_character: function(){
    var temp_index = this.selected_character_index + 1;
    if(temp_index >= this.map.characters.length){
      temp_index = 0;
    }
    this.set_selected_character(temp_index);
  }
});