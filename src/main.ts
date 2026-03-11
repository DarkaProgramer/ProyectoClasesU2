import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Pipe para realizar la validacion de forma global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //Condiguracion de swagger
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentacion de la API para pruebas')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Servidor de pruebas')
    .addServer('http://www.dominio.com', 'Servidor de producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//! npm i mysql
//! npm i @types/mysql

//!git commit -a -m "fix: Uso de providers (pg,mysql) para coneccion a base de datos"

//! npm i @nestjs/swagger

//! git commit -a -m "fix: Correcion del CRUD y uso de swagger"
