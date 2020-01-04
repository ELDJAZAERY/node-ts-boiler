import express from 'express';
import 'express-async-errors';
import errorHandler from './middlewares/errorHandler';
import initRoutes from './init/init.routes';
import initMiddlewares from './init/init.middlewares';

class App {
  private app: express.Express;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  private initializeMiddlewares() {
    initMiddlewares(this.app);
  }

  private initializeControllers() {
    // the auth middleware used with all route controllers except the auth Controller
    initRoutes(this.app);
    // this middleware should be used after the initialization of routes
    this.app.use(errorHandler);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
