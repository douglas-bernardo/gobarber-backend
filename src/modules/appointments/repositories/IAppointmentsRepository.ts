import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppoitmentDTO';
import IFindAllInMonthFromProviders from '../dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProviders from '../dtos/IFindAllInDayFromProvidersDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProviders(
        data: IFindAllInMonthFromProviders,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviders,
    ): Promise<Appointment[]>;
}
