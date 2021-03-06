require('dotenv').config()
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import { COOKIE_NAME } from './constants';
import { createConnection } from "typeorm";
import Post from "./entities/Post";
import User from "./entities/User";

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: process.env.PG_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [Post, User]
  })
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis({
    host: "host.docker.internal",
    port: 6379,
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main();
