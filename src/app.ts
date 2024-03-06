import express, { Application, Request, Response, NextFunction } from 'express';


export class App {

    private app : Application;

    constructor() {
        this.app = express()
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

}