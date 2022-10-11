import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css'
import GeoJSONSource from 'maplibre-gl/src/source/geojson_source'
import { Point } from 'geojson';
import { LayoutRouteProps } from 'react-router-dom';
import { renderToString } from 'react-dom/server'
import harborne from '../JSON/harborne.json';
import quinton from '../JSON/quinton.json';
import svg from '../resources/green_pin_shadow.png';
import question_png from '../resources/question_pin_shadow.png';
import tick_png from '../resources/tick_pin_shadow.png'
import { GiHamburgerMenu } from 'react-icons/gi'
import SideBarSettings from './sidesettings';
import { BiMessageAltAdd } from 'react-icons/bi';
import popup_styles from '../css/popup.module.css';

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

const AddCrossingPopup = (props: { open: boolean, closeCallback: any, acceptCallback: any }) => {
  if (props.open) {
    setTimeout(() => document.getElementById('modal_marker')?.classList.add(popup_styles.open), 1)
    return (
      <div id="modal_marker" className={popup_styles.outer}>
        <div className={popup_styles.holder}>
          <div className={popup_styles.close} onClick={() => { props.closeCallback() }}>x</div>
          <div>Add a crossing here?</div>
          <div className="modal_footer">
            {/* <div className="modal_button cancel" onClick={() => props.closeCallback()}></div> */}
            <div className="modal_button cancel" onClick={() => props.closeCallback()}>Cancel</div>
            <div className="modal_button save" onClick={() => props.acceptCallback()}>Add</div>
          </div>
        </div>
      </div>)
  } else {
    // else{
    document.getElementById('modal_marker')?.classList.remove(popup_styles.open);
    return (<></>)
  }
}




const MapMain = (props: { data: any, id: string | undefined, openImgPopUpCallback: any, setIdCallback: any,updateCallback: any }) => {



  const mapContainer = useRef<any>(null);
  const [map, SetMap] = useState<any>(null);
  const [popup, SetPopup] = useState<any>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<any>({
    "completed": true,
    "incomplete": true,
    "unclassified": true
  });
  const [marker, SetMarker] = useState<any>(null);
  const [markerPopupOpen, setMarkerPopupOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if (map == null) {
      return;
    }

    if (map.getSource('submissions') == null) {
      return;
    }
    map.getSource('submissions').setData(
      data2geojson()
      // cluster: true,
      // clusterMaxZoom: 13, // Max zoom to cluster points on
      // clusterRadius: 40 // Radius of each cluster when clustering points (defaults to 50)
    );

  }, [settings])


  function data2geojson() {

    const tempData = []
    for (let i = 0; i < props.data.length; i++) {

      if (props.data[i].state == 0 && settings.unclassified || props.data[i].state == 1 && settings.incomplete || props.data[i].state == 2 && settings.completed) {

        tempData.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [props.data[i].lon, props.data[i].lat]
          }, "properties": {
            // "time": props.data[i].time,
            "id": props.data[i].id,
            "state": props.data[i].state,
          }
        })
      }
    }

    return ({
      "type": "FeatureCollection",
      "features": tempData
    });
  }
  const addMarker = (() => {
    // props 
    // marker
    // marker 
    setMarkerPopupOpen(true);
    const { lng, lat } = map.getCenter();
    if (marker == null) {
      var marker_ = new maplibregl.Marker({
        color: "#FF3333",
        draggable: true
      }).setLngLat([lng, lat])
        .addTo(map);

      marker_.on('drag', function (e) {
        // props.callback(marker.getLngLat().lat, marker.getLngLat().lng)
      })

      SetMarker(marker_);
    }
  })



  useEffect(() => {
    if (props.id != undefined) {
      addModal(props.id);
    }

  }, [props.id, props.data, map])

  useEffect(() => {
    // This API key is for use only in stackblitz.com
    // Get your Geoapify API key on https://www.geoapify.com/get-started-with-maps-api
    // The Geoapify service is free for small projects and the development phase.
    // const myAPIKey = '18c85a44a76042788847e2fb74d27386';
    const mapStyle =
      'https://api.maptiler.com/maps/openstreetmap/style.json?key=2pdGAnnIuClGHUCta2TU';

    const initialState = {
      lng: -1.9754200516660276,
      lat: 52.46070394113771,
      zoom: 12,
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
        clusterMaxZoom: 13, // Max zoom to cluster points on
        clusterRadius: 40 // Radius of each cluster when clustering points (defaults to 50)

      });




      map.addSource('harborne', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry':
            harborne
        }
      })

      map.addSource('quinton', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry':
            quinton
        }
      })

      map.addLayer({
        'id': 'harborne_fill',
        'type': 'fill',
        'source': 'harborne',
        'layout': {},
        'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.1,
        }
      });

      map.addLayer({
        'id': 'harborne_line',
        'type': 'line',
        'source': 'harborne',
        'layout': {},
        'paint': {
          'line-color': '#088',
          'line-opacity': 1,
          'line-width': 2
        }
      });

      map.addLayer({
        'id': 'quinton_fill',
        'type': 'fill',
        'source': 'quinton',
        'layout': {},
        'paint': {
          'fill-color': '#ff4118',
          'fill-opacity': 0.1,
        }
      });

      map.addLayer({
        'id': 'quinton_line',
        'type': 'line',
        'source': 'quinton',
        'layout': {},
        'paint': {
          'line-color': '#ff4118',
          'line-opacity': 1,
          'line-width': 2
        }
      });

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
        // filter: ["all",['has', 'point_count'], ['==', 'state', 0]],
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

      map.loadImage(svg, function (error, image) {
        if (error) throw error;
        map.addImage('green_pin', image);
        map.addLayer({
          id: 'unclustered-point-1',
          type: 'symbol',
          source: 'submissions',

          filter: ['==', 'state', 1],
          layout: {
            'icon-image': 'green_pin',
            'icon-size': 0.3,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
          }
        });
      })

      map.loadImage(question_png, function (error, image) {
        if (error) throw error;
        map.addImage('question_pin', image);
        map.addLayer({
          id: 'unclustered-point-0',
          type: 'symbol',
          source: 'submissions',

          filter: ['==', 'state', 0],
          layout: {
            'icon-image': 'question_pin',
            'icon-size': 0.3,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
          }
        });
      })

      map.loadImage(tick_png, function (error, image) {
        if (error) throw error;
        map.addImage('tick_png', image);
        map.addLayer({
          id: 'unclustered-point-2',
          type: 'symbol',
          source: 'submissions',

          filter: ['==', 'state', 2],
          layout: {
            'icon-image': 'tick_png',
            'icon-size': 0.3,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
          }
        });
      });

      // var _marker = new maplibregl.Marker({
      //   color: "#FF3333",
      //   draggable: true
      // }).setLngLat([0, 0]).addTo(map);

      // SetMarker(marker);

      // marker.visible = false; 

      // map.addLayer({
      //   id: 'unclustered-point-0',
      //   type: 'circle',
      //   source: 'submissions',

      //   filter: ['==', 'state', 0],
      //   paint: {
      //     // 'circle-color': '#11b4da',
      //     'circle-color': '#ff0505',
      //     'circle-radius': 8,
      //     'circle-stroke-width': 1,
      //     'circle-stroke-color': '#fff'
      //   }
      // });

      // map.addLayer({
      //   id: 'unclustered-point-1',
      //   type: 'circle',
      //   source: 'submissions',

      //   filter: ['==', 'state', 1],
      //   paint: {
      //     // 'circle-color': '#11b4da',
      //     'circle-color': '#ff7b00',
      //     'circle-radius': 8,
      //     'circle-stroke-width': 1,
      //     'circle-stroke-color': '#fff'
      //   }
      // });

      // map.addLayer({
      //   id: 'unclustered-point-2',
      //   type: 'circle',
      //   source: 'submissions',

      //   filter: ['==', 'state', 2],
      //   paint: {
      //     // 'circle-color': '#11b4da',
      //     'circle-color': '#1fbf27',
      //     'circle-radius': 8,
      //     'circle-stroke-width': 1,
      //     'circle-stroke-color': '#fff'
      //   }
      // });


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

      map.on('click', 'unclustered-point-1', function (e) {
        var id = e.features[0].properties.id;
        props.setIdCallback(id);
        props.openImgPopUpCallback()
        window.history.replaceState(null, "BetterStreets", id)
      });

      map.on('click', 'unclustered-point-0', function (e) {
        var id = e.features[0].properties.id;
        props.setIdCallback(id);
        props.openImgPopUpCallback()
        window.history.replaceState(null, "BetterStreets", id)
      });

      map.on('click', 'unclustered-point-2', function (e) {
        var id = e.features[0].properties.id;
        props.setIdCallback(id);
        props.openImgPopUpCallback()
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
    if (popup != null) {
      popup.remove()
    }
    var result = props.data.find(obj => {
      return obj.id === id
    })
    console.log(result, map)
    if (result == undefined || map == undefined) {
      return;
    }
    console.log("addModal2")
    var coordinates = [result.lon, result.lat];

    var time = result.time;

    map.flyTo({
      center: [coordinates[0], coordinates[1]],
      zoom: 17
    });

  }

 function addCrossing(){
  // console.log("Update type", signals);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat:marker.getLngLat().lat, lng: marker.getLngLat().lng })
        };


        fetch('/api/new_crossing', requestOptions)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    response.json().then((data) => {
                        console.log("success")
                        marker.remove();
                        SetMarker(null);
                        props.updateCallback();
                        setMarkerPopupOpen(false);
                        props.setIdCallback(data.id)
                    });
                } else {
                    console.log("Failed Upload")
                }
            })
 }

  return <div className="map-container-main" ref={mapContainer}>
    <AddCrossingPopup open={markerPopupOpen} closeCallback={() => { 
      setMarkerPopupOpen(false) 
      marker.remove();
      SetMarker(null);
      // map.

    }} acceptCallback={() => { addCrossing()
    }
  }
        
    ></AddCrossingPopup>
    <button className="menu-button" onClick={() => { setSettingsOpen(true) }}><GiHamburgerMenu></GiHamburgerMenu></button>
    <button className="menu-button add" onClick={() => { addMarker() }}><BiMessageAltAdd></BiMessageAltAdd></button>
    <SideBarSettings
      settings={settings}
      updateCallback={(val) => { setSettings(val) }}
      closeCallback={() => { setSettingsOpen(false) }}
      open={settingsOpen}></SideBarSettings>
  </div>;
};



export { MapSubmit, MapMain };    