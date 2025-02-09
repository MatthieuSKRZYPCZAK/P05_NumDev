import {User} from "../interfaces/user.interface";
import {RegisterRequest} from "../features/auth/interfaces/registerRequest.interface";
import {LoginRequest} from "../features/auth/interfaces/loginRequest.interface";
import {SessionInformation} from "../interfaces/sessionInformation.interface";
import {Session} from "../features/sessions/interfaces/session.interface";
import {Teacher} from "../interfaces/teacher.interface";
import {SessionService} from "../services/session.service";
import {FormGroup} from "@angular/forms";

export const mockUser: Readonly<User> = Object.freeze({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  admin: true,
  password: 'password12345',
  createdAt: new Date('2024-01-01T15:00:00')
});

export const mockRegisterRequest: Readonly<RegisterRequest> = Object.freeze({
  email: 'newUser@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password:'password12345'
});

export const mockLoginRequest: Readonly<LoginRequest> = Object.freeze({
  email: 'test@example.com',
  password: 'password12345'
});

export const mockSessionInformation: Readonly<SessionInformation> = Object.freeze({
  token: 'fake-token',
  type: 'mockType',
  id: 777,
  username: 'JohnDoe',
  firstName: 'John',
  lastName: 'Doe',
  admin: false
});

export const mockSessionService = Object.freeze({
  sessionInformation: {
    admin: true,
    id: 1
  }
});

export const mockSession: Readonly<Session[]> = Object.freeze([
  {
    id: 1,
    name: 'SessionTest 1',
    description: "Description 1",
    date: new Date(),
    teacher_id: 1,
    users: [1, 2, 3],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'SessionTest 2',
    description: "Description 2",
    date: new Date(),
    teacher_id: 1,
    users: [1,3],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

export const mockTeachers: Readonly<Teacher[]> = Object.freeze([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

export const mockSessionForm = Object.freeze(
  {
        name:'Session Test',
        date: '2025-01-01',
        teacher_id: '1',
        description: 'Description'
      }
);
