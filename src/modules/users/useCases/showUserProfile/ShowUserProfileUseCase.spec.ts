import { SimpleConsoleLogger } from "typeorm"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase : ShowUserProfileUseCase;

describe('Show a User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase =       new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase =  new ShowUserProfileUseCase(inMemoryUsersRepository);
  });
  it ('Should be able to show a user profile', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    const userProfile = await showUserProfileUseCase.execute(user.id as string);
    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("name");
  });
  it ('Should not be able to show a non-existing user profile', async () => {
      await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    expect(async ()=> {
       await showUserProfileUseCase.execute('wrong id');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
