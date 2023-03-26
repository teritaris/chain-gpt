export { Config } from "./config";
import * as Log4js from "log4js";
export const logger = Log4js.configure('logger.json').getLogger("default");
