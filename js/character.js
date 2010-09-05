var Character = Class.create({
  initialize: function(map,sprite_name){
    this.map = map;
    
    this.x = 0;
    this.y = 0;
    
    this.selected = false;

    this.sprite = {
      name:   sprite_name,
      width:    50,
      height:   55,
      offset_x: 0,
      offset_y: -35,
    };
  },
  
  /* {
    x: 1,0,-1,
    y: 1,0,-1
  } */
  controller_input: function(input){
    var new_position = this.position_to_move_to_for_input(input);
    if(this.can_move_to_position(new_position)){
      this.x = new_position.x;
      this.y = new_position.y;
    }
  },
  
  position_to_move_to_for_input: function(input){
    var x = this.x;
    var y = this.y;
    
    if(input.x){
      x += input.x;
    }
    if(input.y){
      y += input.y;
    }
    
    return {x: x, y: y};
  },
  
  can_move_to_position: function(coords){
    return this.map.data[coords.x] && this.map.data[coords.x][coords.y];
  }
});