import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MyPatient } from './interfaces';

function get_patient_name(patient: IPatient): string {
  if (patient.name === undefined) {
    return '';
  }
  if (patient.name.length > 0 && patient.name[0].text !== undefined) {
    return patient.name[0].text;
  }
  return patient.name[0].family! + patient.name[0].given;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}

  getById(patientID: number): Observable<MyPatient> {
    const request_url = `${environment.backendApiUrl}/baseR4/Patient/${patientID}`;
    return this.http.get<IPatient>(request_url).pipe(
      map((patient) => {
        return {
          id: patientID,
          name: get_patient_name(patient),
          gender: patient.gender!,
          birth_date: patient.birthDate!,
          appointments: [],
        };
      })
    );
  }
}
