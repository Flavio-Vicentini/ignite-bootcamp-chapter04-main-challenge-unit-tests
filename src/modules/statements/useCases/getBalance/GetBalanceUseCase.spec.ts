import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import {OperationType} from '../../entities/Statement'
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository =      new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase =            new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase =       new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getBalanceUseCase =            new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
  })
  it ('Should be able to get account user balance', async () => {
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
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      description: "Withdraw Description",
      amount: 37
    });
    const balance = await getBalanceUseCase.execute({user_id: user.id as string});
    expect(balance.balance).toEqual(63);
    expect(balance).toHaveProperty("statement");
    expect(balance.statement).toHaveLength(2);
  });
  it ('Should not be able to get account non-existing user balance', async () => {
      expect( async () => {
        await getBalanceUseCase.execute({
          user_id: 'wrong id',
      });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });

})
