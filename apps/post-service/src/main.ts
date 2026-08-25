import { bootstrapHttpService } from '@/bootstrap/http-service.bootstrap';
import { PostServiceModule } from './post-service.module';

void bootstrapHttpService(PostServiceModule, {
  title: 'Threads Post Service',
  description: 'Posts, polls, and topics API',
  portEnvironmentVariable: 'POST_SERVICE_PORT',
  defaultPort: 3004,
});
