import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global (IMPORTANTE: Esto afecta a todas las URLs)
  app.setGlobalPrefix('api');

  // 2. Escudo de validación global con estilo de memes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Personalizamos la fábrica de excepciones para que no sea técnica
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          // Tomamos los mensajes de error de los DTOs o los genéricos
          return Object.values(err.constraints).join(', ');
        });

        // Aquí lanzamos el error 400 (Bad Request) con tu toque personal
        return new BadRequestException({
          statusCode: 400,
          message: `¡Fíjate bien, mijo! Los datos están mal: ${messages.join(' | ')}. "¡Vaya, no encuentro fallas en su lógica!"`,
          error: 'Bad Request',
        });
      },
    }),
  );

  // 3. CORS - Necesario para que tu Front-End (React/Angular) pueda conectarse
  app.enableCors({
    origin: '*', // En producción deberías poner la URL de tu front
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 4. Swagger - Documentación automática
  const config = new DocumentBuilder()
    .setTitle('Proyecto CAHD API')
    .setDescription(
      'Documentación de API - Seguridad en el Desarrollo de Aplicaciones (UTNG)',
    )
    .setVersion('1.0')
    .addBearerAuth() // Habilitar el botón de "Authorize" para el Token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log de confirmación claro
  logger.log(`==========================================================`);
  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}/api`);
  logger.log(`📖 Documentación (Swagger): http://localhost:${port}/docs`);
  logger.log(`==========================================================`);
}

bootstrap().catch((err) => {
  console.error('❌ Error fatal al iniciar la aplicación:', err);
  process.exit(1);
});
