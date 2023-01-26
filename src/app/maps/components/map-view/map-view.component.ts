import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map, Marker, Popup} from 'mapbox-gl';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {

  @ViewChild("mapDiv")
  mapDivElement!: ElementRef

  constructor(private placesService: PlacesService, private mapService: MapService) { }
  
  ngOnInit(): void {
    console.log(this.placesService.userLocation);
  }

  ngAfterViewInit(): void {

    if(!this.placesService.userLocation) throw Error("No hay placesService.userLocation");

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.userLocation,
      zoom: 14 // starting zoom
      });

      const popUp = new Popup()
        .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
        `);

      new Marker({color: "red"})
      .setLngLat(this.placesService.userLocation)
      .setPopup(popUp)
      .addTo(map)

      this.mapService.setMap(map);
  }

  

}
