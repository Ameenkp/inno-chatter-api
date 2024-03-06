import dotenv from 'dotenv';
import {App} from "./src/app";

class Server {
  private app: App;

  constructor() {
    dotenv.config({ path: '.env.prod' });
    this.app = new App();
  }

  async start() {
    const port = Number(process.env.PORT) || 3000;
    this.app.start(port);
  }
}

const server = new Server();
server.start();
