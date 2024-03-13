
import { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose:true,
    preset:'ts-jest',
    testEnvironment:'node',
    collectCoverage:true,
    coverageDirectory:'coverage',
    coverageThreshold:{
        global:{
            lines:70,
            statements:70
        }
    },
    coverageProvider:'babel',
    moduleFileExtensions:["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["<rootDir>/__tests__/unit/**/*.test.ts"]
};

export default config;