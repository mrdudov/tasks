import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Appointment } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/appointment';
import { MyAppointment } from './interfaces';

export function isAnyPatientInAppointment(
  appointment: Appointment | undefined
): boolean {
  return (
    appointment?.participant != undefined &&
    appointment.participant.some(
      (p) => p.actor?.reference?.split('/')[0] == 'Patient'
    )
  );
}

export function getPatientID(
  appointment: Appointment | undefined
): number | undefined {
  if (appointment?.participant != undefined) {
    for (let participant of appointment.participant) {
      if (participant.actor?.reference?.split('/')[0] == 'Patient') {
        return parseInt(participant.actor?.reference?.split('/')[1]);
      }
    }
  }
  return undefined;
}

export function getPatientAppointments(
  appointments: Appointment[],
  patient_id: number
): MyAppointment[] {
  let result: MyAppointment[] = [];
  for (var appointment of appointments) {
    if (patient_id == getPatientID(appointment)) {
      const myAppointment: MyAppointment = {
        patient_id: patient_id,
        appointment_description: appointment.description!,
        appointment_date_time: appointment.start!,
      };
      result.push(myAppointment);
    }
  }
  return result;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    const request_url = `${environment.backendApiUrl}/baseR4/Appointment?_count=10`;

    return this.http.get<IBundle>(request_url).pipe(
      map((bundle) => bundle.entry!),
      map((bundle_entry) => {
        let result: Appointment[] = [];
        bundle_entry.map((data) => {
          if (
            data.resource?.resourceType === 'Appointment' &&
            isAnyPatientInAppointment(data.resource as Appointment)
          ) {
            result.push(data.resource as Appointment);
          }
        });
        return result;
      })
    );
  }
}
