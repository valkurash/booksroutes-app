import {
  Map,
  Polygon,
  Polyline,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  GeoJSON
} from "react-leaflet";
import React from "react";
import { Point } from "../pages/[lang]/books/[...slug]";
import L  from 'leaflet';

export const pointerIcon = new L.Icon({
  iconUrl: '/pointerIcon.svg',
  iconRetinaUrl: '/pointerIcon.svg',
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [68, 95],
  shadowAnchor: [20, 92],
})
const   geoJSONStyle=()=> {
  return {
    color: '#1f2021',
    weight: 1,
    fillOpacity: 0.5,
    fillColor: '#fff2af',
  }
}
interface Props {
  routeContent: Point[];
  selectShape:(point:Point)=>void
  selected: Point;
}
//Leaflet.LatLngExpression|Leaflet.LatLngExpression[] | Leaflet.LatLngExpression[][]| Leaflet.LatLngExpression[][][]
const getCenter=(coordinates: any[])=> {
  let centerTemp:any[];
  const findCenter = (val:any[]) => {
    if (Array.isArray(val[0])) {
      // @ts-ignore
      findCenter(val[0])
    }else{
      centerTemp=val;
    }
  }
  findCenter(coordinates);
  return centerTemp;
}

const RouteMap: React.FunctionComponent<Props> = ({ routeContent,selectShape,selected }: Props) => {
  const center=selected.shape.type === "Point"?selected.shape.coordinates:getCenter(selected.shape.coordinates);
  return (
    <Map center={[center[1],center[0]]} zoom={13} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeContent.map((item) => {
        const { shape,id }=item;
        return <GeoJSON
          key={id}
          data={shape}
          pointToLayer={(_feature, latLng)=>new L.Marker(latLng, {icon: pointerIcon})}
          style={geoJSONStyle}
          onEachFeature={(_feature, layer)=>{layer.on({
            click: ()=>selectShape(item)
          });}}
        />
      })}
    </Map>
  );
};

export default RouteMap;
