import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

// I'm too lazy to use normal database 💩
const config = new Config("testWorkDatabase", true, false, "/");

export const database = new JsonDB(config);
