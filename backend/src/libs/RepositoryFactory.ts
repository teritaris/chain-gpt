import { Config as C, logger } from "../init";
import {RepositoryFactoryHttp} from "symbol-sdk";

export const createSymbolRepositoryFactory = async (): Promise<RepositoryFactoryHttp> => {
    const node: string = C.conf.symbol.node.host + ':' + C.conf.symbol.node.port;
    return new RepositoryFactoryHttp(node);
}