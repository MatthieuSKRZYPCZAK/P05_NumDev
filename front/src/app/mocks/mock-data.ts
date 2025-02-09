import {User} from "../interfaces/user.interface";
import {RegisterRequest} from "../features/auth/interfaces/registerRequest.interface";
import {LoginRequest} from "../features/auth/interfaces/loginRequest.interface";
import {SessionInformation} from "../interfaces/sessionInformation.interface";

export const mockUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  admin: true,
  password: 'password12345',
  createdAt: new Date('2024-01-01T15:00:00')
}

export const mockRegisterRequest: RegisterRequest = {
  email: 'newUser@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password:'password12345'
};

export const mockLoginRequest: LoginRequest = {
  email: 'test@example.com',
  password: 'password12345'
};

export const mockSessionInformation: SessionInformation = {
  token: 'fake-token',
  type: 'mockType',
  id: 777,
  username: 'JohnDoe',
  firstName: 'John',
  lastName: 'Doe',
  admin: false
};
