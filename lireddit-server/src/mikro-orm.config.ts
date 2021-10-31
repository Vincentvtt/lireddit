import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { User } from './entities/User';

export default {
  migrations: {
      path: "./dist/migrations",
      pattern: /^[\w-]+\d\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  debug: !__prod__,
  username: 'postgres',
  password: '',
} as Parameters<typeof MikroORM.init>[0];