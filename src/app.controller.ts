import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './auth/entity/user.entity';
@Controller()
export class AppController {}
