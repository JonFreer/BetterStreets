import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl'; 
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css'
const MyMap = (props:{markerLat:number, markerLon:number}) => {



      const mapContainer = useRef<any>(null);
      const [map, SetMap]= useState<any>(null);
      const [marker, SetMarker] = useState<any>(null);
      const [startLat, setStartLat] = useState(props.markerLat)
// 
            useEffect(() => {
            if (props.markerLat !== startLat) {
                setStartLat(props.markerLat);// if the props have been updated
                console.log(mapContainer.current)
                marker.setLngLat([props.markerLon,props.markerLat])
                map.setCenter([props.markerLon,props.markerLat])
                // mapContainer.current
            }
            }, [props.markerLat]);
    
      useEffect(() => {
        // This API key is for use only in stackblitz.com
        // Get your Geoapify API key on https://www.geoapify.com/get-started-with-maps-api
        // The Geoapify service is free for small projects and the development phase.
        // const myAPIKey = '18c85a44a76042788847e2fb74d27386';
        const mapStyle =
          'https://api.maptiler.com/maps/basic/style.json?key=2pdGAnnIuClGHUCta2TU';
    
        const initialState = {
          lng: props.markerLon,
          lat: props.markerLat,
          zoom: 16,
        };
        
        console.log(props.markerLat,props.markerLon)
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
            }).setLngLat([props.markerLon,props.markerLat])
            .addTo(map);

        SetMarker(marker);


    
        // mapIsReadyCallback(map);
      }, [mapContainer.current]);
    
      return <div className="map-container" ref={mapContainer}></div>;
    };
    
export default MyMap;    