import configService from "@/config/config";
import Mux from "@mux/mux-node";

export const muxClient = new Mux({
    tokenId: configService.MUX_ACCESS_TOKEN_ID,
    tokenSecret: configService.MUX_SECRET_KEY,
});

