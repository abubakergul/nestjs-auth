import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('protected-route')
export class ProtectedRouteController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe() {
    return 'the protected route is working ';
  }
}
