Array.prototype.dict = function(prop) {
    var obj = {};
    for (var i = 0; i < this.length; i++)
        obj[this[i][prop]] = this[i];
    return obj;
};