import * as config from 'config';
import { ServerConfigIterface, JwtConfigInterface, DataBaseConfigInterface } from "../interface/config.interface";

export const serverConfig: ServerConfigIterface = config.get('server');

export const jwtConfig: JwtConfigInterface = config.get('jwt');

export const dbConfig: DataBaseConfigInterface = config.get('db');
