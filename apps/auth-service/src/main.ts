import { bootstrapHttpService } from '@/bootstrap/http-service.bootstrap';
import { AuthServiceModule } from './auth-service.module';

void bootstrapHttpService(AuthServiceModule, {
  title: 'Threads Auth Service',
  description: 'Authentication, authorization, and administration API',
  portEnvironmentVariable: 'AUTH_SERVICE_PORT',
  defaultPort: 3003,
});
