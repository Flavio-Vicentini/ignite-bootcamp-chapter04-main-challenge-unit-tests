import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import {OperationType} from '../../entities/Statement'
import { CreateStatementError } from "./CreateStatementError"

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository =      new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase =            new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase =       new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })
  it ('Should be able to create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Deposit Description",
      amount: 100
    });
    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.user_id).toEqual(user.id);
  });
  it ('Should not be able to create a statement if user does not exists', async () => {
     expect(async ()=> {
        await createStatementUseCase.execute({
          user_id: 'wrong id',
          type: OperationType.DEPOSIT,
          description: "Deposit Description",
          amount: 100
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
  it ('Should not be able to withdraw if does not have sufficient funds', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        description: "Deposit Description",
        amount: 100
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
