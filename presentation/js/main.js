L.mapbox.accessToken = 'pk.eyJ1IjoidGVhbW1pZGRsZXRhYmxlIiwiYSI6ImNpbDZ0cHRuMDA1eml1MGx2bjVvd2RpNm8ifQ.H7TauzsEVrD4fvr0ORQq8w';

var map = L.mapbox.map('map', 'mapbox.light')
            .setView([43.535139, -80.235302], 12);

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
    foodAggregate = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD)
            values = [];
            min = 0;
            max = 0;
            i = 0;
            for (var key in wardData.food) {
                if (i == 0) {
                    min = wardData.food[key];
                    max = wardData.food[key];
                } else {
                    tmp = wardData.food[key];
                    if (tmp > max) {
                        max = tmp;
                    } else if (tmp < min) {
                        min = tmp;
                    }
                }
                i = i + 1;
            }
            for (var key in wardData.food) {
                tmp = wardData.food[key];
                values.push((tmp - min) / (max - min));
            }
            value = 0;
            values.forEach(function(item) {
                value = value + item
            });
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(value)
            };
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
    incomeAggregate = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD)
            values = [];
            min = 0;
            max = 0;
            i = 0;
            for (var key in wardData.income_employment) {
                if (i == 0) {
                    min = wardData.income_employment[key];
                    max = wardData.income_employment[key];
                } else {
                    tmp = wardData.income_employment[key];
                    if (tmp > max) {
                        max = tmp;
                    } else if (tmp < min) {
                        min = tmp;
                    }
                }
            }
            for (var key in wardData.income_employment) {
                tmp = wardData.income_employment[key];
                values.push((tmp - min) / (max - min));
            }
            value = 0;
            values.forEach(function(item) {
                value = value + item
            });
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(value)
            };
        }
    }),

    medFamIncLayer = L.geoJson(wards, {
        style: function(feature ) {
            wardData = getWardData(feature.properties.WARD);
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.8,
                fillColor: getRentColor(wardData.income_employment.median_fam)
            };
        }
    });

addLayer(medRentLayer, layerMenus["rent"], 'Median Rent / Unit', 1)
addLayer(avgRentLayer, layerMenus["rent"], 'Average Rent / Unit', 2)

addLayer(foodAggregate, layerMenus["food"], 'Food Aggregate', 1)
addLayer(marketBasket, layerMenus["food"], 'Market Basket Measure', 3)
addLayer(busStops, layerMenus["food"], 'Bus Stops (density)', 4)

addLayer(incomeAggregate, layerMenus["income"], 'Income Aggregate', 1)
addLayer(medFamIncLayer, layerMenus["income"], 'Median Family Income', 3)

allLayers = [medRentLayer, avgRentLayer, foodAggregate, marketBasket, busStops, incomeAggregate, medFamIncLayer];

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
