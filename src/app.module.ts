import { Module } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './apis/users/users.module.js';
import { AuthModule } from './apis/auth/auth.module.js';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { FamiliesModule } from './apis/families/families.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthenticationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        accessToken: {
          key: configService.get<string>('jwt.secret') || 'default-secret',
          ttl: '1h',
        },
        refreshToken: false,
      }),
    }),
    AuthorizationModule.forRoot({
      globalGuard: true,
    }),

    UsersModule,
    AuthModule,
    FamiliesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
