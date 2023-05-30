import { Component } from '@angular/core';
import { tap, map, Observable } from 'rxjs';
import {
  AppointmentService,
  getPatientAppointments,
  getPatientID,
} from '../appointment.service';
import { MyPatient } from '../interfaces';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent {
  patients$: Observable<MyPatient[]>;
  constructor(
    private appointmentService: AppointmentService,
    private patientServices: PatientService
  ) {
    this.patients$ = this.appointmentService.getAll().pipe(
      map((appointments) => {
        const patient_ids: Set<number> = new Set();
        appointments.map((appointment) => {
          const p_id = getPatientID(appointment);
          if (p_id) {
            patient_ids.add(p_id);
          }
        });
        return {
          appointments: appointments,
          patient_ids: patient_ids,
        };
      }),
      map((data) => {
        const patients: MyPatient[] = [];
        data.patient_ids.forEach((patient_id) => {
          this.patientServices.getById(patient_id).subscribe((patient) => {
            patient.appointments = getPatientAppointments(
              data.appointments,
              patient.id
            );
            patients.push(patient);
          });
        });
        return patients;
      })
    );
  }
}
