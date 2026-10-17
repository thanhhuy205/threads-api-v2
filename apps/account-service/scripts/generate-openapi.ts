import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stringify } from 'yaml';
import { AppModule } from '../src/app.module';

const outputDirectory = resolve(process.cwd(), 'openapi');
const outputFile = resolve(outputDirectory, 'openapi.yaml');

async function generateOpenAPI() {
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });

  try {
    const config = new DocumentBuilder()
      .setTitle('Microservices API')
      .setDescription('Public API documentation')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    await mkdir(outputDirectory, { recursive: true });
    await writeFile(outputFile, stringify(document), 'utf8');
    console.log(`Generated ${outputFile}`);
  } finally {
    await app.close();
  }
}

generateOpenAPI().catch((error) => {
  console.error('Error generating OpenAPI document:', error);
  process.exitCode = 1;
});
