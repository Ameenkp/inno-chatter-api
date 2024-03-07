import dotenv from 'dotenv';
import { App } from './src/app';
import { MongooseConfig } from './src/config/mongoose.mw';
import { Constants } from './src/config/constants';

class Server {
  private app: App;

  constructor() {
    this.app = new App();
  }

  async start() {
    const port = Constants.PORT;
    await MongooseConfig.connectToLocalDB();
    this.app.start(port);
  }
}

const server = new Server();
server.start();
