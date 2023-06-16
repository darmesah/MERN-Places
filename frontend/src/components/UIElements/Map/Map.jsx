import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import classes from './Map.module.css';

const Map = (props) => {
  const location = props.location;
  const { lng, lat } = location;

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 16,
    });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  }, [lng, lat]);

  return (
    <div
      id="map"
      className={`${classes.map} ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
