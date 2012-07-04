exports.merge = function(obj1, obj2) {
	var = mergeObj = {};
	for (var attr in obj1) {
		mergeObj[attr] = obj1[attr];
	}
	
	for(var attr in obj2) {
		mergeObj[attr] = obj2[attr];
	}
	return mergeObj;
}