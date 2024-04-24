import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { GeoJSONSource} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css'
import './form.css'
import svg from '../resources/green_pin_shadow.png';
import question_png from '../resources/question_pin_shadow.png';
import tick_png from '../resources/tick_pin_shadow.png'
import { GiHamburgerMenu } from 'react-icons/gi'
import SideBarSettings from './sidesettings';
import { BiMessageAltAdd } from 'react-icons/bi';
import popup_styles from '../css/popup.module.css';
import stopwatchCSS from '../css/stopwatch.module.css';
import wards_geo_json from '../JSON/birmingham_wards_compressed13p.geo.json';
import { IoCloseSharp } from 'react-icons/io5';

const AddCrossingPopup = (props: { open: boolean, closeCallback: any, acceptCallback: any }) => {
  if (props.open) {
    setTimeout(() => document.getElementById('modal_marker')?.classList.add(popup_styles.open), 1)
    return (
      <div id="modal_marker" className={popup_styles.outer}>
        <div className={popup_styles.holder}>
          {/* <div className={stopwatchCSS.close} onClick={() => { props.closeCallback() }}>x</div> */}
          <button onClick={()=>props.closeCallback()} className={stopwatchCSS.exit}><IoCloseSharp /></button>
          <div className={stopwatchCSS.heading}>Add a crossing here?</div>
          <div className={stopwatchCSS.sub_heading}>Drag the red marker to the location of the traffic signaled crossing.</div>
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

const MapMain = (props: { data: any, id: string | undefined, openImgPopUpCallback: any, setIdCallback: any, updateCallback: any,  tutorialCallback:any, wards:any,wardsCallback:any}) => {

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



  useEffect(() => {
    if (map == null) {
      return;
    }

    if (map.getSource('submissions') == null) {
      return;
    }
    map.getSource('submissions').setData(
      {
        'type': 'FeatureCollection',
        features: data2geojson()
      },
      // data2geojson()
    );

  }, [settings,props.wards])


  function data2geojson() {
    const tempData = []
    for (let i = 0; i < props.data.length; i++) {

      if(props.wards[props.data[i].ward].active || !Object.values(props.wards).some(e => e["active"]==true)){

        if (props.data[i].state == 0 && settings.unclassified || props.data[i].state == 1 && settings.incomplete || props.data[i].state == 2 && settings.completed) {
          

          tempData.push({
            type: "Feature",
            geometry: {
              type:'Point',
              coordinates: [props.data[i].lon, props.data[i].lat]
            },
            properties: {         
              id: props.data[i].id,
              state: props.data[i].state,
              ward: props.data[i].ward}
          })
        }
      }
    }

    return(tempData)
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
        draggable: true,
        scale:1.5,
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
          data: {
            'type': 'FeatureCollection',
            features: data2geojson()
          },
          cluster: true,
          clusterMaxZoom: 13, // Max zoom to cluster points on
          clusterRadius: 40 // Radius of each cluster when clustering points (defaults to 50)
      });
      
      // map.addSource("wards", wards_geo_json);
  
     
      wards_geo_json.features.forEach((ward)=>{
        let key = ward.properties.WARDNAME
        map.addSource(key, {
          type: 'geojson',
          data: {
            type: 'Feature',
            id: 0,
            geometry:
              ward.geometry as {type: "Polygon"; coordinates: number[][][];} ,
            properties: {}
          },

        })

        map.addLayer({
          'id': key + '_fill',
          'type': 'fill',
          'source': key,
          'layout': {},
          'paint': {
            'fill-color': '#888',
            'fill-opacity': [
              'case',
              ['boolean',["feature-state","hover"], false],
              0.5,
              0.1
              ]
          }
        });

        map.addLayer({
          'id': key + '_line',
          'type': 'line',
          'source': key,
          'layout': {},
          'paint': {
            'line-color': '#888',
            'line-opacity': 1,
            'line-width': 2
          }
        });

      })

      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
        })
      );

      map.addControl(
        new maplibregl.NavigationControl({
          // visualizePitch: true,
          showZoom: true,
          showCompass: true
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
            '#f2621f',
            750,
            '#db1200'
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


      map.loadImage(svg).then((image)=>{
        map.addImage('green_pin', image.data);
        map.addLayer({
          id: 'unclustered-point-1',
          type: 'symbol',
          source: 'submissions',
          filter:['==', 'state', 1],
          // filter: ["all",
          //   ['==', 'state', 1],
          //   ['in', "ward", ...valid],
          // ],
          layout: {
            'icon-image': 'green_pin',
            'icon-size': 0.3,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
          }
        });
      })

   

      map.loadImage(question_png).then((image) => {
        map.addImage('question_pin', image.data);
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

      map.loadImage(tick_png).then((image)=> {
        map.addImage('tick_png', image.data);
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

      map.on('click', 'clusters', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        var clusterId = features[0].properties.cluster_id;

        let source = map.getSource('submissions');
        if (source != undefined) {
          (source as unknown as GeoJSONSource).getClusterExpansionZoom(
            clusterId).then((zoom)  =>{
             
              let c = (features[0].geometry)["coordinates"];

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
    }

    );

  }, [mapContainer.current]);

  useEffect(() => {
    console.log("props.data update")
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

  function addCrossing() {


    props.tutorialCallback(7,{ lat: marker.getLngLat().lat, lng: marker.getLngLat().lng });
    marker.remove();
    SetMarker(null);
    props.updateCallback();
    setMarkerPopupOpen(false);

    if (window.localStorage.getItem("tutorial_complete")!="True"){
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: marker.getLngLat().lat, lng: marker.getLngLat().lng })
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
      props.tutorialCallback(7,null);
    }} acceptCallback={() => {
      addCrossing()
    }
    }

    ></AddCrossingPopup>
    <button className="menu-button" onClick={() => { setSettingsOpen(true) }}><GiHamburgerMenu></GiHamburgerMenu></button>
    <button className="menu-button add" onClick={() => { addMarker() }}><BiMessageAltAdd></BiMessageAltAdd></button>
    <SideBarSettings
      settings={settings}
      updateCallback={(val) => { setSettings(val) }}
      closeCallback={() => { setSettingsOpen(false) }}
      open={settingsOpen}
      data={props.data}
      wards={props.wards}
      wardsCallback={props.wardsCallback}></SideBarSettings>
  </div>;
};

export {  MapMain };    