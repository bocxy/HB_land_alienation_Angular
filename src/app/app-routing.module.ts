import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewLandRecordPageComponent } from './pages/new-land-record-page/new-land-record-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ViewLandRecordPageComponent } from './pages/view-land-record-page/view-land-record-page.component';
import { EditLandRecordComponent } from './pages/edit-land-record/edit-land-record.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'new-land', component: NewLandRecordPageComponent },
  { path: 'view-land-record/:id', component: ViewLandRecordPageComponent },
  { path: 'edit-land-record/:id', component: EditLandRecordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
