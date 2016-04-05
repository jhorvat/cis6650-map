L.mapbox.accessToken = 'pk.eyJ1IjoidGVhbW1pZGRsZXRhYmxlIiwiYSI6ImNpbDZ0cHRuMDA1eml1MGx2bjVvd2RpNm8ifQ.H7TauzsEVrD4fvr0ORQq8w';

var map = L.mapbox.map('map', 'mapbox.light')
            .setView([43.535139, -80.235302], 12),

    layers = document.getElementById('menu-ui'),

    rentLayer = L.geoJson(wards, {
        style: function(feature ) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(feature.properties.total_rentals)
            };
        },
        onEachFeature: function(feature) {
            //alert(feature.properties.total_rentals);
        }
    }),

    busStops = L.geoJson(wards, {
        style: function(feature ) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getBusStopsColor(feature.properties.stopsPerSqKm)
            };
        }
    }),

    kitchens = L.geoJson(wards, {
        style: function(feature ) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getFoodDensityColor(feature.properties.kitchensPerSqKm)
            };
        }
    }),

    pantries = L.geoJson(wards, {
        style: function(feature ) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getFoodDensityColor(feature.properties.pantriesPerSqKm)
            };
        }
    }),

    gardens = L.geoJson(wards, {
        style: function(feature ) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getFoodDensityColor(feature.properties.gardensPerSqKm)
            };
        }
    });

// TODO -
// var foodAggregateLayer = L.geoJson(, {
//     style: function(feature ) {
//         return {
//             weight: 2,
//             opacity: 0.1,
//             color: 'black',
//             fillOpacity: 0.8,
//             fillColor: getColor(feature.properties.food_aggregate)
//         };
//     },
//     onEachFeature: function(feature) {
//         //calculate the aggregate value based on the other food layers
//     }
// });
// foodLayers.push(foodAggregateLayer)

addLayer(rentLayer, 'Rent Layer', 1)
addLayer(busStops, 'Bus Stops (density)', 2)
addLayer(kitchens, 'Kitchens (density)', 3)
addLayer(pantries, 'Pantries (density)', 4)
addLayer(gardens, 'Gardens (density)', 5)

allLayers = [rentLayer, busStops, kitchens, pantries, gardens];

function addLayer(layer, name, zIndex) {
    layer.setZIndex(zIndex);
        // .addTo(map);

    // Create a simple layer switcher that
    // toggles layers on and off.
    var link = document.createElement('a');
        link.href = '#';
        link.className = '';
        link.innerHTML = name;

    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        allLayers.forEach(function(item) {
            if (map.hasLayer(item)) {
                map.removeLayer(item);
                item.className = '';
            }
        });
        menu = document.getElementById('menu-ui');
        for (i=0; i<menu.children.length; i++) {
            menu.children[i].setAttribute('class','')
        }
        menu.children.className = '';

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = '';
        } else {
            map.addLayer(layer);
            this.className = 'active';
        }
    };
    layers.appendChild(link);
}

function getRentColor(d) {
    return d > 8296  ? '#a63603' :
        d > 6639  ? '#e6550d' :
        d > 4980  ? '#fd8d3c' :
        d > 3319   ? '#fdae6b' :
        d > 1659   ? '#fdd0a2' :
        '#feedde';
}
function getBusStopsColor(d) {
    return d > 10  ? '#a63603' :
        d > 8  ? '#e6550d' :
        d > 6  ? '#fd8d3c' :
        d > 4   ? '#fdae6b' :
        d > 2   ? '#fdd0a2' :
        '#feedde';
}
function getFoodDensityColor(d) {
    return d > 0.8  ? '#a63603' :
        d > 0.7  ? '#e6550d' :
        d > 0.5  ? '#fd8d3c' :
        d > 0.1   ? '#fdae6b' :
        d > 0.01   ? '#fdd0a2' :
        '#feedde';
}
