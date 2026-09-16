import { Observable } from 'rxjs';

import {
  FindByUserIdRequest,
  FindByUserIdResponse,
  FindByUsernameRequest,
  FindByUsernameResponse,
  FindExistingIdsRequest,
  FindExistingIdsResponse,
  GetUserByEmailRequest,
  GetUserRequest,
  UserResponse,
} from '@purse/proto/generated/user';

export interface UserGrpcService {
  findExistingIds(
    request: FindExistingIdsRequest,
  ): Observable<FindExistingIdsResponse>;

  getUser(request: GetUserRequest): Observable<UserResponse>;

  getUserByEmail(request: GetUserByEmailRequest): Observable<UserResponse>;

  findByUsername(
    request: FindByUsernameRequest,
  ): Observable<FindByUsernameResponse>;

  findByUserId(
    request: FindByUserIdRequest,
  ): Observable<FindByUserIdResponse>;
}
