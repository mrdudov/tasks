import { Component, Input } from '@angular/core';
import { MyPatient } from '../interfaces';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent {
  @Input() patient: MyPatient;
}
