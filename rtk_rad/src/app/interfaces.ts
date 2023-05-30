export interface MyPatient {
  id: number;
  name: string;
  gender: string;
  birth_date: string;
  appointments: MyAppointment[];
}

export interface MyAppointment {
  patient_id: number;
  appointment_description: string;
  appointment_date_time: string;
}
