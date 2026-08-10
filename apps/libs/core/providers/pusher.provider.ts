import configService from "@/config/config";
import Pusher from "pusher";
export const pusher = new Pusher({
  appId: configService.PUSHER_CONFIG.PUSHER_APP_ID,
  key: configService.PUSHER_CONFIG.PUSHER_KEY,
  secret: configService.PUSHER_CONFIG.PUSHER_SECRET,
  host: configService.PUSHER_CONFIG.PUSHER_HOST,
  port: configService.PUSHER_CONFIG.PUSHER_PORT.toString(),
  useTLS: configService.PUSHER_CONFIG.PUSHER_USE_TLS,
  cluster: configService.PUSHER_CONFIG.PUSHER_CLUSTER,
});
