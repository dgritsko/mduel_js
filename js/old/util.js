if (typeof Mduel == 'undefined') {
   var Mduel = {};
}
if (typeof Mduel.Util == 'undefined') {
   Mduel.Util = {};
}

Mduel.Util.sum = function(arr, accum) {
   var sum = 0;
   
   for (var i = 0, len = arr.length; i < len; i++) {
      sum += accum(arr[i]);
   }   
   
   return sum;
};

Mduel.Util.where = function(arr, pred) {
   var rval = new Array();

   for (var i = 0, len = arr.length; i < len; i++) {
      if (pred(arr[i]))
      {
         rval.push(arr[i]);
      }
   }
   
   return rval;
}

Mduel.Util.removeAt = function(arr, index) {
   arr.splice(index, 1);
   return arr;
}