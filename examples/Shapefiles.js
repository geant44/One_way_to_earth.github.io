/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 *  Illustrates how to load and display shapefiles.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Set up the common placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.025;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        // Callback function for configuring shapefile visualization.
        var shapeConfigurationCallback = function (attributes, record) {
            var configuration = {};
            configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

            if (record.isPointType()) { // Configure point-based features (cities, in this example)
                configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (attributes.values.pop_max) {
                    var population = attributes.values.pop_max;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
             } else if (record.isPolygonType()) { // Configure polygon-based features (countries, in this example).
				//configuration.TOWNCODE = attributes.values.TOWNCODE
				configuration.attributes = new WorldWind.ShapeAttributes(null);

                //if (attributes.values.TOWNCODE) {
                //    var population = attributes.values.TOWNCODE;
                //    configuration.attributes.imageScale = 0.01 * Math.log(population);
                //}
				
                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    1.0);
				if (attributes.values.p) {
					var oldpopulation = attributes.values.p;
					if ( oldpopulation > 200 ){
					configuration.attributes.interiorColor = WorldWind.Color.WHITE;
					//	configuration.attributes.interiorColor = new WorldWind.Color(
					//	  0.375 + 0.5 * Math.float(oldpopulation),
                    //      0.375 + 0.5 * Math.random(),
                    //      0.375 + 0.5 * Math.random(),
                    //      1.0);
					} else if (  oldpopulation > 2000 ){
					configuration.attributes.interiorColor = WorldWind.Color.GREEN;
					//	configuration.attributes.interiorColor = new WorldWind.Color(
					//	  0.375 + 0.5 * Math.float(oldpopulation),
                    //      0.375 + 0.5 * Math.random(),
                    //      0.375 + 0.5 * Math.random(),
                    //      1.0);
					}
				}
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        var shapefileLibrary = "https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/naturalearth";

        // Create data for the world.
        var worldLayer = new WorldWind.RenderableLayer("Countries");
        var worldShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp");
        worldShapefile.load(null, shapeConfigurationCallback, worldLayer);
        wwd.addLayer(worldLayer);

        // Create data for cities.
        var cityLayer = new WorldWind.RenderableLayer("Cities");
        var cityShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_50m_populated_places_simple/ne_50m_populated_places_simple.shp");
        cityShapefile.load(null, shapeConfigurationCallback, cityLayer);
        console.log(cityShapefile)
		wwd.addLayer(cityLayer);
        
        // Create data for Taiwan cities.
        var twcityLayer = new WorldWind.RenderableLayer("TWCities");
        var twcityShapefile = new WorldWind.Shapefile("data/COUNTY_MOI_1080726.shp");
        twcityShapefile.load(null, shapeConfigurationCallback, twcityLayer);
        wwd.addLayer(twcityLayer);
		
		// Create data for Taiwan town.
        var twtownLayer = new WorldWind.RenderableLayer("TWTown");
        var twtownShapefile = new WorldWind.Shapefile("data/TOWN_MOI_1080726.shp");
		//var twtownDBFile = new WorldWind.DBaseFile("data/TOWN_MOI_1080726.dbf");
        twtownShapefile.load(null, shapeConfigurationCallback, twtownLayer);
		//twtownDBFile.load();
		twtownShapefile.attributeFile.getFields()
		//twtownDBFile.readHeader(0)
		//twtownDBFile.parse()
		//var FieldList = [ ];
		//twtownDBFile.getFields(FieldList)
		//var FieldInfo = twtownDBFile.parse(0)
		//console.log(twtownDBFile)
		console.log(twtownShapefile)
		//console.log(twtownDBFile.readFieldDescriptors(twtownDBFile._buffer,"TOWNCODE"))
		//console.log(twtownDBFile.getLastModificationDate())
		//console.log(twtownDBFile.getNumberOfRecords(twtownDBFileload))
		//console.log(twtownDBFile.readFieldDescriptors());
        wwd.addLayer(twtownLayer);

        // Create data for Fort Story (Over Virginia Beach, VA. It can be seen near Norfolk.)
        var fortStory = "https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/misc/FortStory/Trident-Spectre-Indigo-i.shp";
        var fortStoryLayer = new WorldWind.RenderableLayer("Fort Story");
        var fortStoryShapefile = new WorldWind.Shapefile(fortStory);
        fortStoryShapefile.load(null, null, fortStoryLayer);
        wwd.addLayer(fortStoryLayer);

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        //Average Surface Temp
        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
        // Named layer displaying Average Temperature data
        var layerName = "MOD_LSTD_CLIM_M";

        // Called asynchronously to parse and create the WMS layer
        var createLayer = function (xmlDom) {
            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            var wmsLayerCapabilities = wms.getNamedLayer(layerName);
            // Form a configuration object from the WmsLayerCapability object
            var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
            // Modify the configuration objects title property to a more user friendly title
            wmsConfig.title = "Average Surface Temp";
            // Create the WMS Layer from the configuration object
            var wmsLayer = new WorldWind.WmsLayer(wmsConfig);

            // Add the layers to WorldWind and update the layer manager
            wwd.addLayer(wmsLayer);
            layerManager.synchronizeLayerList();
        };

        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);
		
        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
		
		//chage TW position
		//layerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
		layerManager.goToAnimator.goTo(new WorldWind.Location( 25.105497, 121.597366));
    });