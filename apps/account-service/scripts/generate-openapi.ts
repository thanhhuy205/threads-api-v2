import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'node:fs/promises';
import { stringify } from 'yaml';
import { AppModule } from '../src/app.module';
async function generateOpenAPI() {
    const app = await NestFactory.create(AppModule, {
        preview: true,
        logger: false,
    });
    try {
        const config = new DocumentBuilder()
            .setTitle('My API')
            .setVersion('1.0.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(
            app,
            config,
        );


        await writeFile(
            `${process.cwd()}/openapi/openapi.yaml`,
            stringify(document),
            'utf8',
        );

        console.log('Generated openapi.yaml');
    }
    catch (error) {
        console.error('Error generating OpenAPI document:', error);
    }
}

generateOpenAPI().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});