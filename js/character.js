var Character = Class.create({
  initialize: function(sprite_name){
    this.x = 0;
    this.y = 0;

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
    if(input.x){
      this.x += input.x;
    }
    if(input.y){
      this.y += input.y;
    }
  }
});