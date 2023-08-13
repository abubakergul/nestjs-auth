import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import { hashPassword } from 'src/utils/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserExistsException } from '../error/user-exists.exception';
import { NotFoundException } from 'src/error/notFound.exception';
import { UnauthorizedException } from 'src/error/unauthorized.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UserExistsException();
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    // Save the user to the database
    const savedUser = await this.userRepository.save(user);

    // Exclude the password from the returned user object
    const { password: _, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const { password, ...userWithoutPassword } = user;
    return this.signToken(user.id, user.name, user.email);
  }

  async signToken(
    id: number,
    name: string,
    email: string,
  ): Promise<{ token: string }> {
    const payload = {
      sub: id,
      email,
      name,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: '123',
    });
    return {
      ...payload,
      token,
    };
  }
}
