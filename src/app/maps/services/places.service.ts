import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api/placesApiClient';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean{
    return !!this.userLocation;
  }

  constructor(private placesApi: PlacesApiClient, private mapService: MapService) { 
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]>{
    return new Promise ((resolve, reject)=>{
      navigator.geolocation.getCurrentPosition(
        ({coords})=> {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (err) => {
          alert("No se pudo obtener la geolocalización");
          console.log(err);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query=""){
    if(query.length === 0){
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }
    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${query}.json`)
    .subscribe(resp =>{
      this.isLoadingPlaces = false;
      this.places = resp.features;
      this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);
    });
  }

  deletePlaces(){
    this.places = [];
  }

}
