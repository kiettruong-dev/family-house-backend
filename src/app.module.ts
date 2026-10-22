import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { AuthenticationModule } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';

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
  ],
  providers: [AppService],
})
export class AppModule {}
