import configService from "@/config/config";
import Pusher from "pusher";
export const pusher = new Pusher({
  appId: configService.PUSHER_APP_ID,
  key: configService.PUSHER_KEY,
  secret: configService.PUSHER_SECRET,
  host: configService.PUSHER_HOST,
  port: configService.PUSHER_PORT.toString(),
  useTLS: configService.PUSHER_USE_TLS,
  cluster: configService.PUSHER_CLUSTER,
});
