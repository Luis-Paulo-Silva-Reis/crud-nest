import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  //get @Get('test' /users/teste
  @Get()
  getMe() {}
}
