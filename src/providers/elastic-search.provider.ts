import configService from "@/config/config";
import { Client } from "@opensearch-project/opensearch";

export const elasticSearchClient = new Client({
    node: configService.BONSAI_URL,
});
