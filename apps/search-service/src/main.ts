import { bootstrapHttpService } from '@/bootstrap/http-service.bootstrap';
import { SearchServiceModule } from './search-service.module';

void bootstrapHttpService(SearchServiceModule, {
  title: 'Threads Search Service',
  description: 'Post, topic, and user search API',
  portEnvironmentVariable: 'SEARCH_SERVICE_PORT',
  defaultPort: 3005,
});
