import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerSetup {
  setup(app: INestApplication): void {
    const options = new DocumentBuilder()
      .setTitle('User Service API Documentation')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'CUSTOMER_BEARER_AUTH',
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
