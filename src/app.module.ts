import { join } from 'path'; // Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigurations } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    //* Config Module (dotenv)
    ConfigModule.forRoot({
      // envFilePath: '.env',
      load: [EnvConfigurations],
      validationSchema: JoiValidationSchema,
    }),

    //* Static Files
    ServeStaticModule.forRoot({ rootPath: join(__dirname,'..','public') }),

    //* Database Module
    MongooseModule.forRoot(process.env.MONGODB_URL),

    //* Modules
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {}
