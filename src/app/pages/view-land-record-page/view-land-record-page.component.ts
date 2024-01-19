import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-view-land-record-page',
  templateUrl: './view-land-record-page.component.html',
  styleUrls: ['./view-land-record-page.component.css']
})
export class ViewLandRecordPageComponent implements OnInit {
  landRecord: any; // You can use any type here depending on your data structure

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    // Retrieve the id from the URL parameter
    this.route.params.subscribe(params => {
      const landRecordId = +params['id'];
      // Fetch the land record by its ID
      this.http.get<any>(`http://localhost:8080/LandAlienation/get/${landRecordId}`)
        .pipe(
          catchError(error => {
            console.error('Error fetching land record:', error);
            return of(null); // Return an empty observable in case of an error
          })
        )
        .subscribe(
          (data: any) => {
            this.landRecord = data;
            // You can now access the retrieved land record via this.landRecord
          }
        );
    });
  }

  onDeleteLandRecord() {
    if (!this.landRecord) {
      console.error('No land record to delete.');
      return;
    }

    this.http.delete(`http://localhost:8080/land-record/deleteLandRecord/`)
      .subscribe(
        () => {
          console.log('Land record deleted successfully!');
        },
        (error) => {
          console.error('Error deleting land record:', error);
          console.log('Land record could not be deleted');
        }
      );
  }

}
