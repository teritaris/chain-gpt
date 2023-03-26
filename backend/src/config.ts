import { DataSourceOptions } from "typeorm"
import dotenv from "dotenv";
import jsyaml from "js-yaml";
import fs from "fs";
import { Config as C, logger } from './init';
// import MySQLStore, { Options as MySQLStoreOptions } from "express-mysql-session";

dotenv.config();
const STAGE = process.env.STAGE;

interface Config {
    //envはconfigと同じ階層だった気がする
    conf: {
        web: { listen: string, port: number };
        db: DataSourceOptions;
        symbol: {
            node: { networkType: string, host: string, port: number, epochAdjustment: number, generationHash: string },
            addresses: {
                target1: string, proxy: string, constraint: string, tone: string, action: string,
                constraintProxy: string, toneProxy: string, actionProxy: string,
                asker: string
            },
            mosaics: {
                thanks: string
            }
        };
    };
}

export const Config: Config = {
    conf: jsyaml.load(fs.readFileSync(`${__dirname}/../${STAGE}.config.yaml`, "utf8")) as {
        web: { listen: string, port: number },
        db: DataSourceOptions,
        symbol: {
            node: { networkType: string, host: string, port: number, epochAdjustment: number, generationHash: string },
            addresses: {
                target1: string, proxy: string, constraint: string, tone: string, action: string,
                constraintProxy: string, toneProxy: string, actionProxy: string,
                asker: string
            },
            mosaics: { thanks: string }
        }
    }
}
