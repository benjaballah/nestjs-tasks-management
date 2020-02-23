import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import { dbConfig } from '../constant/config.constant';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.DB_TYPE || dbConfig.type,
    host: process.env.DB_HOST || dbConfig.host,
    port: parseInt(process.env.DB_PORT || dbConfig.port, 10),
    username: process.env.DB_USERNAME || dbConfig.username,
    password: process.env.DB_PASSWORD || dbConfig.password,
    database: process.env.DB_DATABASE || dbConfig.database,
    entities: [
        __dirname + '/**/*.entity.{js,ts}',
        __dirname + '/../**/*.entity.{js,ts}',
        __dirname + '/../../**/*.entity.{js,ts}',
    ],
    synchronize: JSON.parse(process.env.DB_SYNCHRONIZE || dbConfig.synchronize)
}
