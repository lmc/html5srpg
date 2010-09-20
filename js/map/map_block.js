var MapBlock = Class.create({
  initialize: function(map,x,y,options){
    this.map = map;
    this.x = x;
    this.y = y;
    
    this.sprite = 'ground';
    
    this.drawable_callback = BlankFunction; //function(canvas,screen_x,screen_y,renderer){ }
    this.drawable_callback = function(canvas,x,y,renderer){
      canvas.fillStyle = 'rgba(255,255,255,0.5)';
      canvas.fillText(""+this.x+","+this.y,x,y);
    };
    
    //console.log('%s,%s is walkable? %s',x,y,this.walkable() ? 'true' : 'false');
  },
  
  walkable: function(){
    return false;
  },
  
  drawable: function(){
    return true;
  }
});

var SolidMapBlock = Class.create(MapBlock,{ walkable: function(){ return true;  } });
var EmptyMapBlock = Class.create(MapBlock,{ drawable: function(){ return false; } });