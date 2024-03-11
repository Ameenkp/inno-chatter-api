
import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose:true,
    preset:'ts-jest',
    testEnvironment:'node',
    collectCoverage:true,
    // collectCoverageFrom:['src/**/*.{ts,tsx',
    //     'src/**/*.{js,jsx}',
    //     '!**/node_modules/**',
    //     '!**/dist/**',
    //     '!**/coverage/**',
    //     '!**/jest.config.ts',
    //     '!**/package.json',
    //     '!**/tsconfig.json',
    //     '!**/tsconfig.node.json',
    //     '!vendor/**.{js,jsx,ts,tsx}',
    //     'server.ts',
    // ],
    coverageDirectory:'coverage',
    coverageThreshold:{
        global:{
            branches:100,
            functions:100,
            lines:100,
            statements:100
        }
    },
    coverageProvider:'babel',
    moduleFileExtensions:["ts", "tsx", "js", "jsx", "json", "node"]
};

export default config;