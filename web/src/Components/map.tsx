import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css'
import GeoJSONSource from 'maplibre-gl/src/source/geojson_source'
import { Point } from 'geojson';
import { LayoutRouteProps } from 'react-router-dom';
import { renderToString } from 'react-dom/server'
// import MapLayerEventType from
const MapSubmit = (props: { markerLat: number, markerLon: number, callback: any }) => {



  const mapContainer = useRef<any>(null);
  const [map, SetMap] = useState<any>(null);
  const [marker, SetMarker] = useState<any>(null);
  // const [startLat, setStartLat] = useState(props.markerLat)
  // 
  useEffect(() => {
    // if (props.markerLat !== startLat) {
    // setStartLat(props.markerLat);// if the props have been updated
    if (marker) {
      console.log(mapContainer.current)
      marker.setLngLat([props.markerLon, props.markerLat])
      map.setCenter([props.markerLon, props.markerLat])
    }

    // mapContainer.current
    // }
  }, [props.markerLat]);

  useEffect(() => {
    // This API key is for use only in stackblitz.com
    // Get your Geoapify API key on https://www.geoapify.com/get-started-with-maps-api
    // The Geoapify service is free for small projects and the development phase.
    // const myAPIKey = '18c85a44a76042788847e2fb74d27386';
    const mapStyle =
      'https://api.maptiler.com/maps/openstreetmap/style.json?key=2pdGAnnIuClGHUCta2TU';

    const initialState = {
      lng: props.markerLon,
      lat: props.markerLat,
      zoom: 16,
    };

    console.log(props.markerLat, props.markerLon)
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapStyle}`,
      center: [props.markerLon, props.markerLat],
      zoom: initialState.zoom,
    });

    // map.set

    SetMap(map);

    var marker = new maplibregl.Marker({
      color: "#FF3333",
      draggable: true
    }).setLngLat([props.markerLon, props.markerLat])
      .addTo(map);

    marker.on('drag', function (e) {
      props.callback(marker.getLngLat().lat, marker.getLngLat().lng)
    })

    SetMarker(marker);



    // mapIsReadyCallback(map);
  }, [mapContainer.current]);

  return <div className="map-container-submit" ref={mapContainer}></div>;
};

const MapMain = (props: { data: any, id: string | undefined , openImgPopUpCallback:any, setIdCallback:any}) => {



  const mapContainer = useRef<any>(null);
  const [map, SetMap] = useState<any>(null);
  const [popup, SetPopup] = useState<any>(null);
  // const [markers, SetMarkers] = useState<any>([]);
  // const [startLat, setStartLat] = useState(props.markerLat)
  // 
  // useEffect(() => {
  //   if (props.markerLat !== startLat) {
  //     setStartLat(props.markerLat);// if the props have been updated
  //     console.log(mapContainer.current)
  //     marker.setLngLat([props.markerLon, props.markerLat])
  //     map.setCenter([props.markerLon, props.markerLat])
  //     // mapContainer.current
  //   }
  // }, [props.startLat]);
  function data2geojson() {
    const tempData = []
    for (let i = 0; i < props.data.length; i++) {
      console.log(props.data[i].lon)
      tempData.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [props.data[i].lon, props.data[i].lat]
        }, "properties": {
          "time": props.data[i].time,
          "id": props.data[i].id
        }
      })
    }
    return ({
      "type": "FeatureCollection",
      "features": tempData
    });
  }

  useEffect(()=>{
    if(props.id!= undefined){
      addModal(props.id);
    }
    
  },[props.id, props.data,map])

  useEffect(() => {
    // This API key is for use only in stackblitz.com
    // Get your Geoapify API key on https://www.geoapify.com/get-started-with-maps-api
    // The Geoapify service is free for small projects and the development phase.
    // const myAPIKey = '18c85a44a76042788847e2fb74d27386';
    const mapStyle =
      'https://api.maptiler.com/maps/openstreetmap/style.json?key=2pdGAnnIuClGHUCta2TU';

    const initialState = {
      lng: -1.78,
      lat: 52.37,
      zoom: 10,
    };

    //   console.log(props.markerLat, props.markerLon)
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapStyle}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    //   // map.set

    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
    });


    map.on("load", function () {
      map.addSource('submissions', {
        'type': 'geojson',
        data: data2geojson(),
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)

      });

      // map.addLayer(
      //   {
      //     'id': 'earthquakes-point',
      //     'type': 'circle',
      //     'source': 'submissions',
      //     'minzoom': 7,
      //     'paint': {
      //       // Size circle radius by earthquake magnitude and zoom level
      //       'circle-radius': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         8,
      //         16,
      //         // 4,
      //         // ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
      //         8,
      //         // 50
      //         // ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
      //       ],
      //       // Color circle by earthquake magnitude
      //       'circle-color': 'rgb(33,102,172)',
      //       //   'interpolate',
      //       //   ['linear'],
      //       //   // ['get', 'mag'],
      //       //   1,
      //       //   'rgba(33,102,172,0)',
      //       //   2,
      //       //   'rgb(103,169,207)',
      //       //   3,
      //       //   'rgb(209,229,240)',
      //       //   4,
      //       //   'rgb(253,219,199)',
      //       //   5,
      //       //   'rgb(239,138,98)',
      //       //   6,
      //       //   'rgb(178,24,43)'
      //       // ],
      //       'circle-stroke-color': 'white',
      //       'circle-stroke-width': 1,
      //       // Transition from heatmap to circle layer by zoom level
      //       'circle-opacity': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         7,
      //         0,
      //         8,
      //         1
      //       ]
      //     }
      //   }
      // );

      map.addControl(
        new maplibregl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        })
        );

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'submissions',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#1a73e8',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'submissions',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,

        },
        paint: {
          "text-color": "#fff"
        }

      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'submissions',

        filter: ['!', ['has', 'point_count']],
        paint: {
          // 'circle-color': '#11b4da',
          'circle-color': '#ff7c17',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      //   map.on('click', 'clusters', (e) => {
      //     const features = map.queryRenderedFeatures(e.point, {
      //       layers: ['clusters']
      //     });
      //     const clusterId = features[0].properties.cluster_id;

      //     let submissions_source = map.getSource('submissons')
      //     if(submissions_source!=undefined){
      //       submissions_source.getClusterExpansionZoom(
      //         clusterId,
      //         (err, zoom) => {
      //           if (err) return;

      //           map.easeTo({
      //             center: features[0].geometry.coordinates,
      //             zoom: zoom
      //           });
      //         }

      //       );
      //     }
      // });

      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;

        let source = map.getSource('submissions');
        if (source != undefined) {
          (source as unknown as GeoJSONSource).getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
              if (err) return;

              let c = (features[0].geometry as Point).coordinates;

              map.easeTo({
                center: [c[0], c[1]],
                zoom: zoom
              });
            }
          );
        }
      });
      
      map.on('click', 'unclustered-point', function (e) {


        // let c = (features[0].geometry as Point).coordinates;
        var coordinates = (e.features[0].geometry as Point).coordinates.slice();

        var time = e.features[0].properties.time;
        var id = e.features[0].properties.id;
        props.setIdCallback(id);
        props.openImgPopUpCallback()

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        // new maplibregl.Popup()
        //   .setLngLat([coordinates[0], coordinates[1]])
        //   .setHTML(
        //     '<img id="popUpImg" class="popup_img" src="/api/img_thumb/' + id + '.WebP" > </img>')
        //   .addTo(map);
        //   document.getElementById("popUpImg").onclick=props.openImgPopUpCallback
          // window.location.pathname=id;
          window.history.replaceState(null, "BetterStreets", id)
      });


      
      

      SetMap(map);

      // if(props.id!=undefined){
      //   addModal(props.id)
      // }
      // SetMap(map);
    }

    );
    // var pointLayer = new maplibregl.Layer

    //   var marker = new maplibregl.Marker({
    //     color: "#FF3333",
    //     draggable: true
    //   }).setLngLat([props.markerLon, props.markerLat])
    //     .addTo(map);

    //   marker.on('drag', function (e) {
    //     props.callback(marker.getLngLat().lat, marker.getLngLat().lng)
    // })

    //   SetMarker(marker);



    //   // mapIsReadyCallback(map);
  }, [mapContainer.current]);

  useEffect(() => {
    if (map != null) {
      // console.log("updated values")
      map.getSource('submissions').setData(data2geojson())
    }

  }, [props.data])


  function addModal(id: string) {
    if(popup!=null){
      popup.remove()
    }
    var result = props.data.find(obj => {
      return obj.id=== id
    })
    console.log(result,map)
    if(result==undefined || map == undefined){
      return;
    }
    console.log("addModal2")
    var coordinates = [result.lon,result.lat];

    var time = result.time;
    // var id = e.features[0].properties.id;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    // }

    map.jumpTo({
      center: [coordinates[0], coordinates[1]],
      zoom: 18
    });
    // var img = <img onClick={()=>{console.log("zoom");props.openImgPopUpCallback()}} className={"popup_img"} src={"/api/img_thumb/" + id + ".WebP"}/> 
    // const pop =new maplibregl.Popup();
    //   pop.setLngLat([coordinates[0], coordinates[1]])
    //   .setHTML(
    //     '<img id="popUpImg" class="popup_img" src="/api/img_thumb/' + id + '.WebP" > </img>'
    //      ).addTo(map);
    //   // pop.remove

      // pop.on('close',()=>{
      //   console.log(window.location.pathname)
      // })

      // document.getElementById("popUpImg").onclick=props.openImgPopUpCallback

      // SetPopup(pop);
  }

  return <div className="map-container-main" ref={mapContainer}></div>;
};

export { MapSubmit, MapMain };    