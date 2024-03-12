import { Router } from 'express';
import { AuthController } from '../controller/authController';

export class AuthRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  /**
   * Set up routes for user login, register, and logout.
   */
  private setupRoutes() {
    /**
     * @swagger
     * /user-login:
     *   post:
     *     summary: User login
     *     operationId: userLogin
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserLogin'
     *     responses:
     *       '200':
     *         description: User successfully logged in
     *       '400':
     *         description: Invalid username or password
     */

    this.router.post('/user-login', AuthController.userLogin);

    /**
     * @swagger
     * /user-register:
     *   post:
     *     summary: User register
     *     operationId: userRegister
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserRegister'
     *     responses:
     *       '200':
     *         description: User successfully registered
     *       '400':
     *         description: Invalid user data
     */

    this.router.post('/user-register', AuthController.userRegister);

    /**
     * @swagger
     * /user-logout:
     *   post:
     *     summary: User logout
     *     operationId: userLogout
     *     tags:
     *       - Authentication
     *     responses:
     *       '200':
     *         description: User successfully logged out
     *       '400':
     *         description: Invalid user data
     */

    this.router.post('/user-logout', AuthController.userLogout);
  }

  public getRouter() {
    return this.router;
  }
}
