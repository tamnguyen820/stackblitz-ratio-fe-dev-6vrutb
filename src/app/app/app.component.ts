import { Component, OnInit } from "@angular/core";
import { LngLatLike, MapLayerMouseEvent } from "maplibre-gl";
import { GeoJsonProperties } from "geojson";
import { DataRetrievalService } from "./services/data-retrieval.service";

interface IncomeStats {
  minIncome: number;
  maxIncome: number;
  averageIncome: number;
}

@Component({
  selector: "ratio-app",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  popupLocation: LngLatLike | null;
  geoJSONData: GeoJSON.FeatureCollection;
  selectedPointProperties: GeoJsonProperties;
  incomeStats: IncomeStats;
  cursorStyle: string;
  areaTrueFillPopupColor: string;
  areaNameFieldPopupColor: string;

  constructor(private dataRetrievalService: DataRetrievalService) {}

  public ngOnInit() {
    this.retrieveData();
  }

  retrieveData() {
    this.geoJSONData = this.dataRetrievalService.retrieveGeoJSON();
    this.incomeStats = this.calculateIncomeStats();
  }

  calculateIncomeStats(): IncomeStats {
    const incomes = this.geoJSONData.features.map((feature) => {
      return feature.properties["Total income: Average amount ($)"];
    });
    const minIncome = Math.min(...incomes);
    const maxIncome = Math.max(...incomes);
    const averageIncome =
      incomes.reduce((acc, curr) => acc + curr, 0) / incomes.length;
    return { minIncome, maxIncome, averageIncome };
  }

  onMapClick() {
    this.popupLocation = null;
  }

  onLayerClick(event: MapLayerMouseEvent) {
    // Set location, properties, and colors for popup
    this.popupLocation = event.lngLat;
    this.selectedPointProperties = event.features?.[0]?.properties;
    this.setPopupColors(event);
  }

  setPopupColors(event: MapLayerMouseEvent) {
    const paint = event.features?.[0]?.layer?.paint;
    if (!paint) return;
    const fillColor = paint["fill-color"];
    const fillOpacity = paint["fill-opacity"];

    this.areaTrueFillPopupColor = this.calculateRGBAColor(
      fillColor,
      fillOpacity
    );
    this.areaNameFieldPopupColor = this.calculateRGBAColor(
      fillColor,
      fillOpacity * 0.3
    );
  }

  calculateRGBAColor(
    color: { r: number; g: number; b: number; a: number },
    opacity: number
  ): string {
    const { r, g, b, a } = color;
    const rgbaColor = `rgba(${Math.round(r * 255)}, ${Math.round(
      g * 255
    )}, ${Math.round(b * 255)}, ${a * opacity})`;
    return rgbaColor;
  }
}
