import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able update the profile from non-existing user', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'non-existing-user',
                name: 'test',
                email: 'test@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@email.com',
        });

        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@email.com');
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'test@email.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johndoe@email.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@email.com',
            old_password: '123123',
            password: '1231234',
        });

        expect(updatedUser.password).toBe('1231234');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@email.com',
                password: '1231234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'John Trê',
                email: 'johntre@email.com',
                old_password: 'wrong-old-password',
                password: '1231234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
