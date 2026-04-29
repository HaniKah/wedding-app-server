import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../types/auth/auth.dto';
import { User } from '../decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/delete')
  async deleteUser(@User() user: CurrentUser) {
    await this.usersService.deleteUser(user.id);
  }
}
