var Engine = Class.create({
  initialize: function(canvas){
    this.map = null;
    this.renderer = null;
    
    this.initialize_map();
    this.initialize_renderer(canvas);
    this.initialize_controls();
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
  },
  
  initialize_renderer: function(canvas){
    this.renderer = new Renderer(canvas.getContext('2d'));
    this.renderer.map = this.map;
    
    this.renderer.load_sprite('ground');
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
        
        case 'O': this.renderer.rotate_camera( 1); break;
        case 'P': this.renderer.rotate_camera(-1); break;
      }
    }.bind(this));
  },
  
  get_selected_character: function(){
    return this.map.characters[0];
  }
});