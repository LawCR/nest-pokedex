import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('port');

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true, 
      // transformOptions: {
      //   enableImplicitConversion: true // Convierte los parametros de los controladores a su tipo de dato
      // }
      // forbidNonWhitelisted: true,
    })
  );
  await app.listen(PORT);
  console.log(`App running on port ${PORT}`)
  
}
bootstrap();
