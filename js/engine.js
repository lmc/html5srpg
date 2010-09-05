var Engine = Class.create({
  initialize: function(canvas){
    this.map = null;
    this.renderer = null;
    
    this.initialize_map();
    this.initialize_renderer(canvas);
  },
  
  initialize_map: function(){
    var map_data = [
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,1,1,0,0],
      [1,1,1,0,0],
      [1,1,1,1,1]
    ];
    
    this.map = new Map(map_data);
    
    var character = new Character('sprite');
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
  }
});