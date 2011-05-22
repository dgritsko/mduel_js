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
}