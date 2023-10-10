import "dotenv/config";
import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";

import { config } from "dotenv";
import validateEnv from "./utils/validateEnv";
import { Route } from "./interfaces/Route.interface";
import logger from "./utils/logger";

let path = ".env";
if (process.env.NODE_ENV === "test") {
  path = ".env.test";
}
config({ path });
validateEnv();

class App {
  app: Application;
  name: string;
  port: string | number;
  env: string;
  isProduction: boolean;
  version: string;
  private readonly isTest: boolean;
  private readonly routes: Route[];

  constructor(routes: Route[], isTest = false) {
    this.app = express();
    this.name = process.env.APP_NAME || "app";
    this.port = process.env.PORT || 3200;
    this.env = process.env.APP_ENV || "local";
    this.isProduction = process.env.APP_ENV === "production";
    this.version = process.env.APP_VERSION || "0.0.1";
    this.isTest = isTest;
    this.routes = routes;
  }

  public async initializeApp(): Promise<void> {
    if (!this.isTest) {
      // (await) connect to db
    }
    this.initializeMiddlewares();
    this.initializeRoutes(this.routes);
  }

  public async listen(): Promise<void> {
    const server = this.createServer(this.app);
    server.listen(this.port, () => {
      logger.info(`App listening on port ${this.port}`);
    });
  }

  public getServer(): Application {
    return this.app;
  }

  private createServer(app: Application): http.Server {
    return http.createServer(app);
  }

  private initializeMiddlewares(): void {
    if (this.isProduction) {
      this.app.use(hpp());
      this.app.use(helmet());
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Route[]): void {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
    this.app.use("/ready", (req: Request, res: Response) => {
      res.status(200).send("Success");
    });
  }
}

export default App;
