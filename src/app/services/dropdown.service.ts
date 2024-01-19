import { Injectable } from '@angular/core';
import { Division, District, Taluk, Village } from '../models/dropdown';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Location } from '../models/location.models';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }
  getAllDivisions(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseUrl}/LandAlienation/division`);
  }

  getDistrictsByDivision(division: string) {
    return this.http.get<Location[]>(`http://localhost:8080/LandAlienation/districts/${division}`).pipe(
      map((data) => data.map((location) => location.district))
    );
  }

  getTaluksByDistrict(selectedDivision: string, selectedDistrict: string): Observable<string[]> {
    return this.http.get<Location[]>(`${this.baseUrl}/land-record/district/${selectedDivision}/${selectedDistrict}`)
      .pipe(
        map((locations: Location[]) => locations.map((location: Location) => location.taluk))
      );
  }
  getDivisions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/division`);
  }

  getDistricts(division: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/districts/${division}`);
  }

  getTaluks(division: string, district: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/taluk/${division}/${district}`);
  }

  getVillages(division: string, district: string, taluk: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/village/${division}/${district}/${taluk}`);




    
  }
  getAllDistrictsByDivision(division: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/LandAlienation/districts/${division}`);
  }

  getTaluksByDistrictAndDivision(division: string, district: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/LandAlienation/taluk/${division}/${district}`);
  }

  getVillagesByDistrictAndTalukAndDivision(division: string, district: string, taluk: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/LandAlienation/village/${division}/${district}/${taluk}`);
  }

  
}