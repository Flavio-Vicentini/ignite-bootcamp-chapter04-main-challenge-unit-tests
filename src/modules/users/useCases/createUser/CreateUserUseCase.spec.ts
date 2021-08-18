import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create a new User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it ('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    expect(user).toHaveProperty("id");
  });
})
