var MapBlock = Class.create({
  initialize: function(map,x,y,options){
    this.map = map;
    this.x = x;
    this.y = y;
    
    this.sprite = 'ground';
    
    console.log('%s,%s is walkable? %s',x,y,this.walkable() ? 'true' : 'false');
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