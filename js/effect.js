var Effect = Class.create({
  initialize: function(renderer){
    this.created_at = new Date;
    
    this.renderer = renderer;
    
    this.sprite = null;
    
    this.origin_x = null;
    this.origin_y = null;
  },
  
  set_origin: function(object){
    this.origin_x = object.x;
    this.origin_y = object.y;
  },
  
  blit: function(canvas){
    var coords = this.renderer.map2canvas(this.origin_x,this.origin_y);
    
    console.log(canvas);
    console.log(coords);
    console.log(this.sprite);
    
    canvas.drawImage(this.sprite,coords.x,coords.y);
  }
});