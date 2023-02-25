import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Policies } from 'src/iam/authorization/decorators/policies.decorator';
import { OnlyAdminPolicy } from 'src/iam/authorization/policies/only-admin.policy';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUserById(
    @Param('id') id: string,
  ): Promise<Pick<User, 'id' | 'email' | 'isTfaEnabled' | 'role'>> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @ActiveUser() user: ActiveUserData,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.update({
      where: { id: Number(id) },
      data,
    });
  }

  @Policies(new OnlyAdminPolicy())
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove({ id: Number(id) });
  }
}
