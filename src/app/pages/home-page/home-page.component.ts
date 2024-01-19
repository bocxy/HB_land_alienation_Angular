import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { LandRecord } from 'src/app/models/landRecord';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { LandRecordService } from 'src/app/services/land-record.service';
import { Location } from 'src/app/models/location.models';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  locations: Location[] = [];
  divisions: string[] = [];
  districts: string[] = [];
  taluks: string[] = [];
  villages: string[] = [];
  

  selectedDivision: string | null = null;
  selectedDistrict: string | null = null;
  selectedTaluk: string | null = null;
  selectedVillage: string | null = null;
  originalLandRecords: LandRecord[] = [];

  landRecordColumns: string[] = ['sno', 'division', 'schemeName', 'landsAlienated', 'GO', 'district', 'taluk', 'village', 'action'];

  allLandRecords: MatTableDataSource<LandRecord> = new MatTableDataSource<LandRecord>([]);

  constructor(private http: HttpClient, private landRecordService: LandRecordService, private router: Router,) { }

  ngOnInit() {
    this.getLandData();
    this.landRecordService.getAllDivisions().subscribe((locations: Location[]) => {
      this.locations = locations; // Store the location data
      this.divisions = locations.map((location: Location) => location.division);
      console.log(this.divisions);
    });
  }

  onGetLandData() {
    this.getLandData();
  }

  private getLandData() {
    this.http.get<{ [key: string]: LandRecord }>('http://localhost:8080/LandAlienation/GetAllData')
      .pipe(map((res) => {
        const landRecords = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            landRecords.push({ ...res[key], id: key });
          }
        }
        return landRecords;
      }))
      .subscribe((landRecords) => {
        // Set the original data and the data source
        this.originalLandRecords = landRecords;
        this.allLandRecords.data = landRecords;

        // Filter unique values for division, district, and taluk
        this.divisions = _.uniq(_.map(landRecords, 'division'));
        console.log(this.divisions);
        this.districts = _.uniq(_.map(landRecords, 'district'));
        this.taluks = _.uniq(_.map(landRecords, 'taluk'));
      });
  }


  filteredDivisionData: LandRecord[];
  onDivisionChanges(selectedDivision: string) {
    console.log('Selected Division:', selectedDivision);

    this.landRecordService.getDistrictsByDivision(selectedDivision).subscribe(
      (districts: string[]) => { // Update the parameter type to string[]
        this.districts = districts; // Assign the received districts directly to the component's districts array
        console.log('Filtered Districts:', this.districts);
      },
      (error) => {
        console.error('Error fetching districts:', error);
      }
    );

    const tableFilters = [];
    tableFilters.push({
      division: 'division',
      value: selectedDivision
    });


    this.allLandRecords.filter = JSON.stringify(tableFilters);
  }

  onDistrictChanges() {
    console.log('Selected District:', this.selectedDistrict);

    this.selectedTaluk = null;

    this.taluks = this.getFilteredValues('taluk', this.selectedDivision, this.selectedDistrict);
    console.log('Filtered Taluks:', this.taluks);

    this.villages = [];
  }

  onTalukChanges() {
    this.villages = this.getFilteredValues('village', this.selectedDivision, this.selectedDistrict, this.selectedTaluk);
  }


  private getFilteredValues(property: keyof LandRecord, division?: string, district?: string, taluk?: string): string[] {
    const uniqueValues: Set<string> = new Set();

    this.allLandRecords.data.forEach((record) => {
      if ((!division || record.division === division) &&
        (!district || record.district === district) &&
        (!taluk || record.taluk === taluk)) {
        uniqueValues.add(record[property]);
      }
    });

    return Array.from(uniqueValues);
  }

  // Function to download the data as an Excel file
  downloadAsPDF(): void {
    const doc = new jsPDF();

    // Load your logo as an image (replace 'path/to/logo.png' with the actual path)
    const logoPath = '../../../assets/images/tnhb_logo.png';

    // Set the position for the logo on the first page
    const logoX = 15;
    const logoY = 15; // Adjust the Y position of the logo as needed
    const logoWidth = 100; // Adjust the width of the logo as needed
    const logoHeight = 20; // Adjust the height of the logo as needed

    // Convert MatTable data to a 2D array for the PDF table
    const tableData: any[][] = [];
    this.allLandRecords.data.forEach((record: LandRecord) => {
      tableData.push([
        record.division,
        record.name_of_scheme,
        record.land_alienated,
        record.go_details,
        record.district,
        record.taluk,
        record.village
      ]);
    });

    // Define table headers
    const headers = ['Division', 'Scheme Name', 'Lands Alienated (in acres)', 'GO Details', 'District', 'Taluk', 'Village'];

    // Calculate the logo's height and add some spacing (adjust as needed)
    const logoSpace = logoHeight + 10; // 10 pixels of spacing after the logo

    // Calculate the number of rows that fit on the first page
    const rowHeight = 10; // Adjust the row height as needed
    const remainingPageHeight = doc.internal.pageSize.height - logoSpace;
    const rowsPerPage = Math.floor(remainingPageHeight / rowHeight);

    // Function to add the logo to the first page's header
    const addLogoToHeader = () => {
      doc.setPage(1);
      doc.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);
    };

    // Generate the PDF table using jspdf-autotable plugin with a custom header function
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: logoSpace + rowHeight, // Adjust the Y position of the table as needed
      didDrawPage: addLogoToHeader, // Add the logo to the header of the first page
    });

    // Start adding the subsequent pages and the remaining table data
    let startRow = rowsPerPage;
    while (startRow < tableData.length) {
      doc.addPage();

      // Add the table on the current page
      (doc as any).autoTable({
        head: [headers],
        body: tableData.slice(startRow, startRow + rowsPerPage),
        startY: 10, // Adjust the Y position of the table as needed
      });

      // Move to the next set of rows for the next page
      startRow += rowsPerPage;
    }

    // Save the PDF file with the name "land_records.pdf"
    doc.save('land_records.pdf');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allLandRecords.filter = filterValue.trim().toLowerCase();
  }

  onDivisionChange(selectedDivision: string) {
    this.selectedDivision = selectedDivision;
    this.selectedDistrict = null;
    this.selectedTaluk = null;
    this.updateFilters();
  }

  onDistrictChange(selectedDistrict: string) {
    this.selectedDistrict = selectedDistrict;
    this.selectedTaluk = null;
    this.updateFilters();
  }

  onTalukChange(selectedTaluk: string) {
    this.selectedTaluk = selectedTaluk;
    this.updateFilters();
  }

  private updateFilters() {
    this.districts = this.getUniqueValues('district', this.selectedDivision);
    this.taluks = this.getUniqueValues('taluk', this.selectedDivision, this.selectedDistrict);
    this.villages = this.getUniqueValues('village', this.selectedDivision, this.selectedDistrict, this.selectedTaluk);
    this.filterTableData();
  }

  private filterTableData() {
    const filteredData = this.originalLandRecords.filter((record) => {
      const divisionMatch = !this.selectedDivision || record.division === this.selectedDivision;
      const districtMatch = !this.selectedDistrict || record.district === this.selectedDistrict;
      const talukMatch = !this.selectedTaluk || record.taluk === this.selectedTaluk;
      return divisionMatch && districtMatch && talukMatch;
    });
    this.allLandRecords.data = filteredData;
  }

  private getUniqueValues(property: keyof LandRecord, division?: string, district?: string, taluk?: string): string[] {
    const uniqueValues: Set<string> = new Set();

    this.originalLandRecords.forEach((record) => {
      if ((!division || record.division === division) &&
        (!district || record.district === district) &&
        (!taluk || record.taluk === taluk)) {
        uniqueValues.add(record[property]);
      }
    });

    return Array.from(uniqueValues);
  }

  clearFilters() {
    this.selectedDivision = null;
    this.selectedDistrict = null;
    this.selectedTaluk = null;
    this.updateFilters();
  }
}


