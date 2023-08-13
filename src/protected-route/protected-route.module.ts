import { Module } from '@nestjs/common';
import { ProtectedRouteController } from './protected-route.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProtectedRouteController],
  imports: [AuthModule],
})
export class ProtectedRouteModule {}
