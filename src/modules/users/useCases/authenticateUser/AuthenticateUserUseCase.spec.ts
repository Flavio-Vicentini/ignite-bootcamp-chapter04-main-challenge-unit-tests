import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate a User", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase =       new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });
  it ("Should be able to authenticate a user", async () => {
    const {id, email} = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    const responseToken = await authenticateUserUseCase.execute({email,password: "test"});
    expect(responseToken).toHaveProperty("token");
    expect(responseToken.user.id).toBe(id);
  });

  it ("Should not be able to authenticate a non-existing user", async () => {
    expect (async ()=> {
      await authenticateUserUseCase.execute({email: "no-existing@user.com.br",password: "test"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it ("Should not be able to authenticate with a incorrect password", async () => {
    expect (async ()=> {
      await authenticateUserUseCase.execute({email: "test@example.com", password: "wrong"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})

