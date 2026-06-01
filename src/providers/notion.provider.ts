import configService from "@/config/config"
import { Client } from "@notionhq/client"
import "dotenv/config"

export const notion = new Client({ auth: configService.NOTION_TOKEN })
