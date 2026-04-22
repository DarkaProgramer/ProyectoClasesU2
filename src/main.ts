import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // 2. Configuración del escudo de validación (ValidationPipe)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Descomenta la siguiente línea si quieres que las validaciones
      // devuelvan errores más detallados en desarrollo
      // disableErrorMessages: false,
    }),
  );

  // 3. Habilitar CORS (Necesario para conectar con React/Frontend)
  app.enableCors();

  // 4. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Proyecto CAHD API')
    .setDescription(
      'Documentación de API - Seguridad en el Desarrollo de Aplicaciones (UTNG)',
    )
    .setVersion('1.0')
    .addBearerAuth() // Soporte para JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Cambiado a 'docs' para no chocar con el prefijo 'api'

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}/api`);
  logger.log(`📖 Documentación disponible en: http://localhost:${port}/docs`);
}

// Manejo de errores global para el inicio
bootstrap().catch((err) => {
  console.error('❌ Error fatal al iniciar la aplicación:', err);
  process.exit(1);
});
