if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Pickups == 'undefined') {
   Mduel.Pickups = {};
}


Mduel.Pickups.pickups = function(spec) {
   var that = {};
 
   that.items = [];
   
   that.update = function(elapsed) {
      while (that.items.count < 3) {
         that.items.push(that.createItem());      
      }
   }
   
   that.draw = function(ctx, elapsed) {
      // TODO   
   }
   
   that.createItem = function() {
      return {};   
   }
   
   return that;
}