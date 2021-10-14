import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { CreateTransferUseCase } from './CreateTransferUseCase';


export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const {receiver_id:user_id} = request.params
    const { amount, description } = request.body;


    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      user_id,
      sender_id,
      type:OperationType.TRANSFER as OperationType,
      amount,
      description
    });

    return response.status(201).json(transfer);
  }
}
