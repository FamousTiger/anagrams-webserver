import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ShutdownService } from './app.shutdown.service';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);
  app.get(ShutdownService).subscribeToShutdown(() => app.close());

  const config = app.get('ConfigService');
  app.setGlobalPrefix(config.get('BASE_URL'));
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT;
  await app.listen(port);
  console.log('Server started on port', port);
}

bootstrap();
