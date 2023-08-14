import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './auth/entity/user.entity';
import { ProtectedRouteModule } from './protected-route/protected-route.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cjcvklvdb61s73acv8tg-a',
      port: 5432,
      username: 'root',
      password: 'sj5pDEi5nUJNE0v1LSCbXlaXziSaWSrO',
      database: 'nestjs_i3hi',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    ProtectedRouteModule,
  ],
})
export class AppModule {}
