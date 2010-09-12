var Engine = Class.create({
  initialize: function(canvas,effects_canvas){
    this.map = null;
    this.renderer = null;
    
    this.prng_seed = 0;
    
    this.initialize_map();
    this.initialize_renderer(canvas,effects_canvas);
    this.initialize_controls();
    
    //ensure we have someone selected at init
    this.selected_character_index = -1;
    this.cycle_selected_character();
  },
  
  initialize_map: function(){
    var map_data = [
      [0,0,1,0,0,0,0,0,0,0],
      [0,1,1,1,0,0,0,0,1,0],
      [1,1,1,0,0,0,0,0,1,1],
      [1,1,1,0,0,0,0,0,1,0],
      [1,1,1,1,1,0,0,0,0,0]
    ];
    
    this.map = new Map(map_data);
    
    var character = new Character(this.map,'sprite');
    character.x = 2;
    character.y = 2;
    this.map.characters.push(character);
    
    var character = new Character(this.map,'sprite');
    character.x = 3;
    character.y = 8;
    this.map.characters.push(character);
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
    this.get_selected_character().selected = true;
  },
  
  cycle_selected_character: function(){
    var temp_index = this.selected_character_index + 1;
    if(temp_index >= this.map.characters.length){
      temp_index = 0;
    }
    this.set_selected_character(temp_index);
  }
});