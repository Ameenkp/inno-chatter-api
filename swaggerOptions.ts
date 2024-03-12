import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'InnoChatter API',
            version: '1.0.0',
            description: 'API documentation for InnoChatter application',
            contact: {
                name: 'ameenkp',
                email: 'alameenkp9068@email.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:8000', // Update with your actual port
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                UserLogin: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                        },
                        password: {
                            type: 'string',
                        },
                    },
                    required: ['username', 'password'],
                },
                UserRegister: {
                    type: 'object',
                    properties: {
                        userName: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        password: {
                            type: 'string',
                        },
                        confirmPassword: {
                            type: 'string',
                        },
                        image: {
                            type: 'file',
                            format: 'binary',
                        },
                    },
                    required: ['userName', 'email', 'password', 'confirmPassword', 'image'],
                },
                MessageSend: {
                    type: 'object',
                    properties: {
                        senderId: {
                            type: 'string',
                        },
                        reseverId: {
                            type: 'string',
                        },
                        message: {
                            type: 'string',
                        },
                    },
                    required: ['senderId', 'reseverId'],
                },
                UserUpdate: { // New schema for user updates
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                        },
                        userName: {
                            type: 'string',
                        },
                    },
                    required: [],
                },
            },
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'authToken',
                },
            },
        },
    },
    apis: [path.join(__dirname, 'src/routes', '*.ts')],
};

export default swaggerOptions;
