import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import {OperationType} from '../../entities/Statement'
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository =       new InMemoryUsersRepository();
    inMemoryStatementsRepository =  new InMemoryStatementsRepository();
    createUserUseCase =             new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase =        new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase =  new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })
  it ('Should be able to get a user statement operation', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Deposit Description",
      amount: 100
    });
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });
    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation.type).toEqual(OperationType.DEPOSIT);
    expect(statementOperation.amount).toEqual(100);
  });
  it ('Should not be able to get a user statement operation if user doest not exists', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Deposit Description",
      amount: 100
    });
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'wrong id',
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it ('Should not be able to get a non-existing user statement', async () => {
    const user = await createUserUseCase.execute({
      name : "User test",
      email : "test@example.com",
      password : "test"
    });
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "Deposit Description",
      amount: 100
    });
    expect(async () => {
     await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: 'wrong statament id'
        });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
