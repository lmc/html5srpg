var Effect = Class.create({
  initialize: function(renderer){
    this.created_at = new Date;
    
    this.renderer = renderer;
    
    this.sprite = null;
    this.cycle_length = -0.25; //TODO: Find a way to set the cycle_length in ms
    
    this.origin_x = null;
    this.origin_y = null;
    
    this.radius = 20; //px
  },
  
  set_origin: function(object){
    this.origin_x = object.x;
    this.origin_y = object.y;
  },
  
  blit: function(canvas){
    var coords = this.renderer.map2canvas(this.origin_x,this.origin_y);
    var angle = (((new Date) - this.created_at) * this.cycle_length) % 360;
    
    coords.y -= 50; //HACK
    
    coords.x = coords.x + this.radius * Math.cos(angle * Math.PI / 180);
    coords.y = coords.y + this.radius * Math.sin(angle * Math.PI / 180);
    
    canvas.drawImage(this.sprite,coords.x,coords.y);
  }
});