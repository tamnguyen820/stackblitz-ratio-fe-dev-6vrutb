import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { NgxMapLibreGLModule } from "@maplibre/ngx-maplibre-gl";
import { LngLatLike, MapLayerMouseEvent } from "maplibre-gl";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [NgxMapLibreGLModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should retrieve data on initialization and calculate income stats", () => {
    expect(component.geoJSONData).toBeDefined();
    expect(component.incomeStats).toBeDefined();
  });

  it("should calculate income stats correctly", () => {
    // Setup
    component.geoJSONData = {
      type: "FeatureCollection",
      features: [
        {
          properties: { "Total income: Average amount ($)": 100 },
          type: "Feature",
          geometry: undefined,
        },
        {
          properties: { "Total income: Average amount ($)": 50 },
          type: "Feature",
          geometry: undefined,
        },
        {
          properties: { "Total income: Average amount ($)": 300 },
          type: "Feature",
          geometry: undefined,
        },
      ],
    };

    const incomeStats = component.calculateIncomeStats();

    expect(incomeStats.minIncome).toEqual(50);
    expect(incomeStats.maxIncome).toEqual(300);
    expect(incomeStats.averageIncome).toEqual(150);
  });

  it("should set popup location on layer click and reset on map click", () => {
    const mockEvent = {
      lngLat: { lng: 0, lat: 0 },
    } as MapLayerMouseEvent;
    component.onLayerClick(mockEvent);
    expect(component.popupLocation).toEqual(mockEvent.lngLat);

    component.onMapClick();
    expect(component.popupLocation).toBeNull();
  });

  it("should set selected point properties on layer click", () => {
    const mockEvent = {
      lngLat: { lng: 0, lat: 0 },
      features: [
        {
          properties: {
            AREA_NAME: "Test Area",
            "Final 2016 demographics table_Average household size": 2,
            "Population 2016": 100,
            "Total income: Average amount ($)": 5000,
          },
        },
      ],
    } as unknown as MapLayerMouseEvent;
    component.onLayerClick(mockEvent);
    expect(component.selectedPointProperties).toEqual(
      mockEvent.features[0].properties
    );
  });

  it("should calculate RGBA color with given fill color and opacity", () => {
    const fillColor = { r: 0.5, g: 0.5, b: 0.5, a: 1 };
    const opacity = 0.5;
    const expectedResult = "rgba(128, 128, 128, 0.5)";
    expect(component.calculateRGBAColor(fillColor, opacity)).toEqual(
      expectedResult
    );
  });

  it("should set popup colors on layer click", () => {
    const mockEvent = {
      features: [
        {
          layer: {
            paint: {
              "fill-color": { r: 0.5, g: 0.5, b: 0.5, a: 1 },
              "fill-opacity": 0.5,
            },
          },
        },
      ],
    } as unknown as MapLayerMouseEvent;
    component.setPopupColors(mockEvent);
    expect(component.areaTrueFillPopupColor).toEqual(
      "rgba(128, 128, 128, 0.5)"
    );
    expect(component.areaNameFieldPopupColor).toEqual(
      "rgba(128, 128, 128, 0.15)"
    );
  });
});
