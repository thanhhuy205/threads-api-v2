import { Observable } from 'rxjs';

import {
  FindByUsernameRequest,
  FindByUsernameResponse,
} from '@purse/proto/generated/user';

export interface UserGrpcService {
  findByUsername(
    request: FindByUsernameRequest,
  ): Observable<FindByUsernameResponse>;
}
