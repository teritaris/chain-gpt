import { DataSource } from "typeorm"
import { Config as C, logger } from "./init";

export const DB = new DataSource(C.conf.db);

DB.initialize().then(() => {
    logger.info("Data Source has been initialized!");
}).catch((err: Error) => {
    throw new Error(`Error during Data Source initialization: ${err.toString()} ${JSON.stringify(C.conf.db)}`);
});

