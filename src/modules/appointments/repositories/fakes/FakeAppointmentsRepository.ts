import { getDate, getMonth, getYear, isEqual } from 'date-fns';
import { v4 as uuid } from 'uuid';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppoitmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProvidersDTO from '@modules/appointments/dtos/IFindAllInDayFromProvidersDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProvidersDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
        return appointments;
    }

    public async findAllInMonthFromProviders({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProvidersDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
        return appointments;
    }

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id,
        );
        return findAppointment;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            date,
            provider_id,
            user_id,
        });

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
