var Map = Class.create({
  initialize: function(map_data){
    this.data = map_data;
    
    this.characters = [];
    
    this.tile = {
      width:  54,
      height: 26
    };
  }
});
