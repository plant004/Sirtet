/*
 * $Id: clone.js,v 0.1 2007/11/26 14:17:22 dankogai Exp dankogai $
 */

(function(){
    // They are atomic already
    var atomic = [ Boolean, Number, String, Date, RegExp ];
    for (var i = 0, l = atomic.length; i < l; i++){
	atomic[i].prototype.clone = function(){ return this; }
    }
    // now the moment of truth!
    Object.prototype.clone = function(){
	if (this.prototype && this.prototype.clone 
	    && this.prototype.clone !== Object.prototype.clone)
	    return this.clone();
	var clone = new (this.constructor);
	for (var p in this) {
	    if (!this.hasOwnProperty(p)) continue;
	    clone[p] = typeof this[p] == 'object' ? this[p].clone() : this[p];
	}
	return clone;
    }
})();
