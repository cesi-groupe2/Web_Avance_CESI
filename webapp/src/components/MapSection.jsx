import React from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapWrapper = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapClickHandler = ({ onClick }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (!map) return;
    
    const handleClick = (e) => {
      onClick(e);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);
  
  return null;
};

const MapSection = ({ 
  center, 
  markerPosition, 
  onMapClick, 
  onMarkerDragEnd,
  zoom = 15 
}) => {
  return (
    <MapWrapper>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && (
          <Marker 
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              dragend: onMarkerDragEnd
            }}
          />
        )}
        <MapClickHandler onClick={onMapClick} />
      </MapContainer>
    </MapWrapper>
  );
};

export default MapSection; 