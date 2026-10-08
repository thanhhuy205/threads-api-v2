import type { ConnectMediaCommand } from '../../commands/connect-media.command';

export const MEDIA_PORT = Symbol('MEDIA_PORT');

export interface MediaPort {
  connectMedia(command: ConnectMediaCommand): Promise<void>;
}
