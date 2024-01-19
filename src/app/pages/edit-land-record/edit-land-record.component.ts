import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LandRecordService } from 'src/app/services/land-record.service';
import { LandAlienation } from '../../models/location.models';
@Component({
  selector: 'app-edit-land-record',
  templateUrl: './edit-land-record.component.html',
  styleUrls: ['./edit-land-record.component.css']
})
export class EditLandRecordComponent implements OnInit {
  landRecord: any = [];

  selectedGOFile: File | null = null;
  selectedOtherFile: File | null = null;
 

  constructor(private route: ActivatedRoute, private http: HttpClient, private landRecordService: LandRecordService) { }

  ngOnInit() {
    // Retrieve the id from the URL parameter
    this.route.params.subscribe(params => {
      const landRecordId = +params['id'];
      // Fetch the land record by its ID
      this.landRecordService
        .getLandRecordById(landRecordId) // Assuming you have implemented this method in the service.
        .pipe(
          catchError(error => {
            console.error('Error fetching land record:', error);
            return of(null); // Return an empty observable in case of an error
          })
        )
        .subscribe((data: LandAlienation) => {
          if (data) {
            this.landRecord = data;
            // You can now access the retrieved land record via this.landRecord
          } else {
            // Handle the case when data is not found.
          }
        });
    });
  }

  onGOFileSelected(event: any) {
    this.selectedGOFile = event.target.files[0];
    console.log(this.selectedGOFile);
  }
  onOtherFileSelected(event: any) {
    this.selectedOtherFile = event.target.files[0];
    console.log(this.selectedOtherFile);
  }

  onUpdateLandRecord() {
    // Create an object with the updated fields
    const updatedLandRecord: LandAlienation = {
      ...this.landRecord, // Copy all properties from the original landRecord object
      name_of_scheme: this.landRecord.name_of_scheme,
      land_alienated: this.landRecord.land_alienated,
      date_of_enterupon_permission: this.landRecord.date_of_enterupon_permission,
      // Add other fields here that you want to update
    };
  
    this.landRecordService
      .updateLandRecord(this.landRecord.id, updatedLandRecord)
      .subscribe(
        (data: LandAlienation) => {
          console.log('Land record updated successfully:', data);
          // You can handle success here, e.g., show a success message or redirect to another page.
        },
        error => {
          console.error('Error updating land record:', error);
          // You can handle errors here, e.g., show an error message to the user.
        }
      );
  }
}