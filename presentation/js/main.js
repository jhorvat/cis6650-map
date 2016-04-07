L.mapbox.accessToken = 'pk.eyJ1IjoidGVhbW1pZGRsZXRhYmxlIiwiYSI6ImNpbDZ0cHRuMDA1eml1MGx2bjVvd2RpNm8ifQ.H7TauzsEVrD4fvr0ORQq8w';

var map = L.mapbox.map('map', 'mapbox.light', {
                zoomControl: false
            }).setView([43.535139, -80.235302], 12);

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

// Disable tap handler, if present.
if (map.tap) map.tap.disable();

var getWardData = function(wardNum) {
    if (wardNum == "1") {
        return ward1;
    } else if (wardNum == "2") {
        return ward2;
    } else if (wardNum == "3") {
        return ward3;
    } else if (wardNum == "4") {
        return ward4;
    } else if (wardNum == "5") {
        return ward5;
    } else if (wardNum == "6") {
        return ward6;
    }
};

var layerMenus = {
        "food": $("#collapseOne"),
        "rent": $("#collapseTwo"),
        "income": $("#collapseThree"),
    },
    layerItemTemplate = _.template($("#layerTPL").html()),

    //Food
    // aggregate = L.geoJson(wards, {
    //     style: function(feature ) {
    //         wardData = getWardData(feature.properties.WARD)
    //         return {
    //             weight: 2,
    //             opacity: 0.1,
    //             color: 'black',
    //             fillOpacity: 0.8,
    //             fillColor: getRentColor(wardData.housing.median_rent_unit)
    //         };
    //     }
    // }),

    wardLabelsLayer = L.geoJson(wardLabels, {
        pointToLayer: function(feature, ll) {
            return L.marker(ll, {
                icon: L.divIcon({
                    className: 'ward-label',
                    html: feature.properties.title,
                    iconSize: [60, 60]
                })
            });
        }
    }),

    marketBasket = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(wardData.food.market_basket)
            };
        }
    }),

    busStops = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            value = wardData.food.bus_stops / wardData.general.area
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getBusStopsColor(value)
            };
        }
    }),

    //Housing
    medRentLayer = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(wardData.housing.median_rent_unit)
            };
        }
    }),

    avgRentLayer = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(wardData.housing.average_rent_unit)
            };
        }
    }),

    //Income & Employment
    // aggregate = L.geoJson(wards, {
    //     style: function(feature ) {
    //         wardData = getWardData(feature.properties.WARD)
    //         return {
    //             weight: 2,
    //             opacity: 0.1,
    //             color: 'black',
    //             fillOpacity: 0.8,
    //             fillColor: getRentColor(wardData.income.median_rent_unit)
    //         };
    //     }
    // }),

    medFamIncLayer = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(wardData.income.median_fam)
            };
        }
    });

addLayer(medRentLayer, layerMenus["rent"], 'Median Rent / Unit', 1)
addLayer(avgRentLayer, layerMenus["rent"], 'Average Rent / Unit', 2)

addLayer(marketBasket, layerMenus["food"], 'Market Basket Measure', 3)
addLayer(busStops, layerMenus["food"], 'Bus Stops (density)', 4)

addLayer(medFamIncLayer, layerMenus["income"], 'Median Family Income', 3)

allLayers = [medRentLayer, avgRentLayer, marketBasket, busStops, medFamIncLayer, wardLabelsLayer];

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
        map.addLayer(wardLabelsLayer);
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
