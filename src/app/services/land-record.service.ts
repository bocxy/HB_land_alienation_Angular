import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Location } from '../models/location.models';
import { LandAlienation } from '../models/location.models';
@Injectable({
  providedIn: 'root'
})
export class LandRecordService {



  private baseUrl = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080/upload';
  private apiUrl1 = 'http://localhost:8080/upload1';

  constructor(private http: HttpClient) { }

  createLandRecord(landRecord: {
    name_of_scheme: string,
    land_alienated: string,
    date_of_enterupon_permission: string,
    sf_number: string,
    go_details: string,
    ownership_land_revenue: string,
    utilization_land: string
  },
    division: string,
    district: string,
    taluk: string,
    village: string
  ) {

    const postData = { ...landRecord, division, district, taluk, village };

    this.http.post(`${this.baseUrl}/LandAlienation/add`, postData)
      .subscribe(
        (response) => {
          console.log('Data posted successfully:', response);
          
        },
        (error) => {
          console.error('Error posting data:', error);
         
        }
      );

  }

  uploadFiles(GOFile: File, otherFile: File) {
    const formData = new FormData();
    formData.append('file', GOFile, GOFile.name);
    formData.append('file', otherFile, otherFile.name);

    console.log(formData);
    console.log('file sent to serve');
    return this.http.post('http://localhost:8080/upload/upload', formData);
  }

  getAllDivisions(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.baseUrl}/GetAllData`);
  }

  getDistrictsByDivision(division: string) {
    return this.http.get<Location[]>(`http://localhost:8080/LandAlienation/division/${division}`).pipe(
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

 

  getLandRecordById(id: number): Observable<LandAlienation> {
    const url = `${this.baseUrl}/LandAlienation/get/${id}`;
    return this.http.get<LandAlienation>(url).pipe(
      catchError((error) => {
        console.error('Error fetching land record:', error);
        throw error; // Rethrow the error to be handled by the component.
      })
    );
  }

  updateLandRecord(id: number, data: LandAlienation): Observable<LandAlienation> {
    const url = `${this.baseUrl}/LandAlienation/edit/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<LandAlienation>(url, data, httpOptions).pipe(
      catchError((error) => {
        console.error('Error updating land record:', error);
        throw error; // Rethrow the error to be handled by the component.
      })
    );
  }
  
  uploadFile(file: File, landid: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('landid', landid);

    const httpOptions = {
      headers: new HttpHeaders({
        // Add any headers if needed (e.g., authorization token)
      })
    };

    return this.http.post<any>(this.apiUrl1, formData, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while uploading the file.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status + ' ' + error.statusText + ': ' + error.error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  uploadFile1(file: File, landid: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('landid', landid);

    const httpOptions = {
      headers: new HttpHeaders({
        // Add any headers if needed (e.g., authorization token)
      })
    };

    return this.http.post<any>(this.apiUrl, formData, httpOptions).pipe(
      catchError(this.handleError1)
    );
  }

  private handleError1(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while uploading the file.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status + ' ' + error.statusText + ': ' + error.error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
