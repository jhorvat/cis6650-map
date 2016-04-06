// Not to be used stand alone, I copy pasted this into browser console while stopped @ a breakpoint in main.js
ward1layer = L.geoJson(ward1)
ward2layer = L.geoJson(ward2)
ward3layer = L.geoJson(ward3)
ward4layer = L.geoJson(ward4)
ward5layer = L.geoJson(ward5)
ward6layer = L.geoJson(ward6)

var wardnumber = function(item) {
	lat = item['Latitude'];
	long = item['Longitude'];

	//one of the files had lowercase
	if (!lat) {
		lat = item['latitude'];
	}

	if (!long) {
		long = item['longitude'];
	}

	if (leafletPip.pointInLayer([long, lat],ward1layer).length == 1) {
		return '1';
	} else if (leafletPip.pointInLayer([long, lat],ward2layer).length == 1) {
		return '2';
	} else if (leafletPip.pointInLayer([long, lat],ward3layer).length == 1) {
		return '3';
	} else if (leafletPip.pointInLayer([long, lat],ward4layer).length == 1) {
		return '4';
	} else if (leafletPip.pointInLayer([long, lat],ward5layer).length == 1) {
		return '5';
	} else if (leafletPip.pointInLayer([long, lat],ward6layer).length == 1) {
		return '6';
	}
};

kijiji.forEach(function(item){
	item['ward'] = wardnumber(item);
});
JSON.stringify(kijiji); //just prints out all the json to console

gottarent.forEach(function(item){
	item['ward'] = wardnumber(item);
})
JSON.stringify(gottarent);

cannon.forEach(function(item){
	item['ward'] = wardnumber(item);
});
JSON.stringify(cannon);