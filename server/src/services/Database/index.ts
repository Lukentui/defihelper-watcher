import knex from 'knex';
import { Factory } from '@services/Container';
import fs from 'fs';

export interface ConnectFactoryConfig {
  readonly host?: string;
  readonly port?: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly ssl: string;
}

export function pgConnectFactory(config: ConnectFactoryConfig) {
  return () =>
    knex({
      client: 'pg',
      connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl
          ? {
              ca: fs.readFileSync(config.ssl),
            }
          : undefined,
      },
    });
}

export function tableFactory<R extends any = {}, L extends any[] = R[]>(
  table: string,
  schema: string = 'public',
) {
  return (connectFactory: Factory<knex>) => () => {
    const connect = connectFactory();

    return connect<R, L>(table).withSchema(schema);
  };
}
