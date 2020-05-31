import { Map, TileLayer, GeoJSON } from "react-leaflet";
import React from "react";
import { Point } from "../pages/[lang]/books/[...slug]";
import L from "leaflet";

export const pointerIcon = (selected: boolean) =>
  new L.Icon({
    iconUrl: selected ? "/marker-selected.svg" : "/marker.svg",
    iconRetinaUrl: selected ? "/marker-selected.svg" : "/marker.svg",
    iconAnchor: selected ? [35, 70] : [25, 50],
    iconSize: selected ? [70, 70] : [50, 50]
  });
const geoJSONStyle = (selected: boolean) => {
  return {
    color: selected?"#FFC473":"#D5243E",
    weight: 7,
    fillOpacity: 0.5,
    fillColor: selected?"#D5243E":"#FFC473"
  };
};
interface Props {
  routeContent: Point[];
  selectShape: (point: Point) => void;
  selected?: Point;
}

const RouteMap: React.FunctionComponent<Props> = ({
  routeContent,
  selectShape,
  selected
}: Props) => {


  const group = new L.FeatureGroup()
  routeContent.forEach((r:Point)=>group.addLayer(new L.GeoJSON(r.shape)));
  const groupBounds = group.getBounds();
  const groupCenter = groupBounds.getCenter();

  const bounds = selected &&
    new L.GeoJSON(selected.shape).getBounds();
  const center=bounds&&bounds.getCenter()

  return (
    <Map
      center={selected?center:groupCenter}
      boundsOptions={{padding: [50, 50]}}
      bounds={selected?bounds:groupBounds}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeContent.map(item => {
        const { shape, id } = item;
        return (
          <GeoJSON
            key={`${
              selected &&selected.id.toString() === id.toString() ? "selected-" : ""
            }${id}`}
            data={shape}
            pointToLayer={(_feature, latLng) =>
              new L.Marker(latLng, {
                icon: pointerIcon(!!selected && selected.id.toString() === id.toString())
              })
            }
            style={geoJSONStyle(!!selected && selected.id.toString() === id.toString())}
            onEachFeature={(_feature, layer) => {
              layer.on({
                click: () => {
                  selectShape(item);
                }
              });
            }}
          />
        );
      })}
    </Map>
  );
};

export default RouteMap;
