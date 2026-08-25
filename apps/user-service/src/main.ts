import { bootstrapHttpService } from '@/bootstrap/http-service.bootstrap';
import { UserServiceModule } from './user-service.module';

void bootstrapHttpService(UserServiceModule, {
  title: 'Threads User Service',
  description: 'Users, teams, skills, and position history API',
  portEnvironmentVariable: 'USER_SERVICE_PORT',
  defaultPort: 3006,
});
