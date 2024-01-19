import { Component } from '@angular/core';
import { Division, District, Taluk, Village } from '../../models/dropdown';
import { FormControl, NgForm } from '@angular/forms';
import { DropdownService } from '../../services/dropdown.service';
import { of, startWith, switchMap, tap } from "rxjs";
import { LandRecordService } from '../../services/land-record.service';
import { Location } from '../../models/location.models';
@Component({
  selector: 'app-new-land-record-page',
  templateUrl: './new-land-record-page.component.html',
  styleUrls: ['./new-land-record-page.component.css'],
})

export class NewLandRecordPageComponent {
  districts: any[];
  taluks: any[];
  villages: any[];

  constructor(private dropdownService: DropdownService, private landRecordService: LandRecordService) { }

  divisionControl = new FormControl<Division | null>(null);
  districtControl = new FormControl<District | null>(null);
  talukControl = new FormControl<Taluk | null>(null);
  villageControl = new FormControl<Village | null>(null);
  divisions: Location[] = [];
  selectedDivision: any;
  selectedDistrict: any;
  selectedTaluk: any;
  selectedVillage: any;
  appid:"1";
  selectedGOFile: File | null = null;
  selectedOtherFile: File | null = null;
  ngOnInit() {
    this.dropdownService.getAllDivisions().subscribe(
      (divisions) => {
       
        this.divisions = divisions;
        console.log(divisions); 
      },
      (error) => {
        
        console.error('Error fetching divisions:', error);
      }
    );
  }


 
  onGOFileSelected(event: any) {
    this.selectedGOFile = event.target.files[0];
    console.log(this.selectedGOFile);
  }
  onOtherFileSelected(event: any) {
    this.selectedOtherFile = event.target.files[0];
    console.log(this.selectedOtherFile);
  }

  onCreateLandRecord(landRecord: {
    name_of_scheme: string,
    land_alienated: string,
    date_of_enterupon_permission: string,
    sf_number: string,
    go_details: string,
    ownership_land_revenue: string,
    utilization_land: string
  }) {
    const division = this.selectedDivision;
    const district = this.selectedDistrict;
    const taluk = this.selectedTaluk;
    const village = this.selectedVillage;

    this.landRecordService.createLandRecord(landRecord, division, district, taluk, village);

    if (this.selectedGOFile) {
      this.landRecordService.uploadFile(this.selectedGOFile, this.appid).subscribe(
        response => {
          console.log('File uploaded successfully!', response);
          // Handle success response
        },
        error => {
          console.error('Error uploading file:', error);
          // Handle error response
        }
      );
    }
  
    if (this.selectedOtherFile) {
      this.landRecordService.uploadFile1(this.selectedOtherFile, this.appid).subscribe(
        response => {
          console.log('File uploaded successfully!', response);
          // Handle success response
        },
        error => {
          console.error('Error uploading file:', error);
          // Handle error response
        }
      );
    }
  }
onDivisionChange(selectedDivision: string): void {
  this.selectedDivision = selectedDivision;
  this.selectedDistrict = '';
  this.selectedTaluk = '';
  this.selectedVillage = '';
  this.districts = [];
  this.taluks = [];
  this.villages = [];
  if (this.selectedDivision) {
    this.getDistrictsByDivision(this.selectedDivision);
  }
}

onDistrictChange(selectedDistrict: string): void {
  this.selectedDistrict = selectedDistrict;
  this.selectedTaluk = '';
  this.selectedVillage = '';
  this.taluks = [];
  this.villages = [];
  if (this.selectedDistrict) {
    this.getTaluksByDistrictAndDivision(this.selectedDivision, this.selectedDistrict);
  }
}

onTalukChange(selectedTaluk: string): void {
  this.selectedTaluk = selectedTaluk;
  this.selectedVillage = '';
  this.villages = [];
  if (this.selectedTaluk) {
    this.getVillagesByDistrictAndTalukAndDivision(this.selectedDivision, this.selectedDistrict, this.selectedTaluk);
  }
}

onVillageChange(selectedVillage: string): void {
  this.selectedVillage = selectedVillage;
  if (this.selectedVillage) {
    this.getDivisionByVillage(this.selectedVillage);
  }
}
  getDivisionByVillage(selectedVillage: any) {
    throw new Error('Method not implemented.');
  }

private getDistrictsByDivision(division: string): void {
  this.dropdownService.getAllDistrictsByDivision(division).subscribe(
    (districts: string[]) => {
      this.districts = districts;
      console.log(districts);
    },
    (error: any) => {
      console.error('Error fetching districts:', error);
      
    }
  );
}

private getTaluksByDistrictAndDivision(division: string, district: string): void {
  this.dropdownService.getTaluksByDistrictAndDivision(division, district).subscribe(
    (taluks: string[]) => {
      this.taluks = taluks;
    },
    (error: any) => {
      console.error('Error fetching taluks:', error);
    }
  );
}

private getVillagesByDistrictAndTalukAndDivision(division: string, district: string, taluk: string): void {
  this.dropdownService.getVillagesByDistrictAndTalukAndDivision(division, district, taluk).subscribe(
    (villages: string[]) => {
      this.villages = villages;
      console.log(villages);
    },
    (error: any) => {
      console.error('Error fetching villages:', error);
    }
  );
}


}

