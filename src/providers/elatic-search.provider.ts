import configService from "@/config/config";
import { Client } from "@elastic/elasticsearch";

export const elasticSearchClient = new Client({
    node: configService.node,
});