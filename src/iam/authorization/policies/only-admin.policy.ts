import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandlerStorage } from './policy-handlers.storage';

export class OnlyAdminPolicy implements Policy {
  name = 'OnlyAdmin';
}

@Injectable()
export class OnlyAdminPolicyHandler implements PolicyHandler<OnlyAdminPolicy> {
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(OnlyAdminPolicy, this);
  }

  async handle(policy: OnlyAdminPolicy, user: ActiveUserData): Promise<void> {
    const isAdmin = user.role === Role.ADMIN;
    if (!isAdmin) {
      throw new Error('User is not an admin');
    }
  }
}
