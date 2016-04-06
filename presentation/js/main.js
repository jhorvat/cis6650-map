L.mapbox.accessToken = 'pk.eyJ1IjoidGVhbW1pZGRsZXRhYmxlIiwiYSI6ImNpbDZ0cHRuMDA1eml1MGx2bjVvd2RpNm8ifQ.H7TauzsEVrD4fvr0ORQq8w';

var map = L.mapbox.map('map', 'mapbox.light')
            .setView([43.535139, -80.235302], 12);

var layerMenus = {
        "food": $("#collapseOne"),
        "rent": $("#collapseTwo"),
        "income": $("#collapseThree"),
    },
    layerItemTemplate = _.template($("#layerTPL").html()),

    wardLabelsLayer = L.geoJson(wardLabels, {
        pointToLayer: function(feature, ll) {
            return L.marker(ll, {
                icon: L.divIcon({
                    className: 'label',
                    html: feature.properties.title,
                    iconSize: [100, 40]
                })
            });
        }
    }),

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

map.addLayer(wardLabelsLayer);

addLayer(rentLayer, layerMenus["rent"], 'Rent Layer', 1)
addLayer(busStops, layerMenus["income"], 'Bus Stops (density)', 2)
addLayer(kitchens, layerMenus["food"], 'Kitchens (density)', 3)
addLayer(pantries, layerMenus["food"], 'Pantries (density)', 4)
addLayer(gardens, layerMenus["food"], 'Gardens (density)', 5)

allLayers = [rentLayer, busStops, kitchens, pantries, gardens];

function addLayer(layer, layerMenu, name, zIndex) {
    layer.setZIndex(zIndex);
        // .addTo(map);

    // Create a simple layer switcher that
    // toggles layers on and off.
    var link = $.parseHTML(layerItemTemplate({ layerName: name }).trim())[0];
    console.log(layerMenu);
    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        allLayers.forEach(function(item) {
            if (map.hasLayer(item)) {
                map.removeLayer(item);
                item.className = '';
            }
        });

        $(".menu-ui .list-group-item").removeClass("active")
        $(this).addClass('active');
        map.addLayer(layer);
    };
    layerMenu.append(link);
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
