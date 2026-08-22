module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/apps/api/src/$1',
    '^@notification-service/(.*)$': '<rootDir>/apps/notification-service/src/$1',
    '^@upload-service/(.*)$': '<rootDir>/apps/upload-service/src/$1',
    '^@notification/(.*)$': '<rootDir>/apps/notification-service/src/notification-group/$1',
    '^@upload/(.*)$': '<rootDir>/apps/upload-service/src/upload/$1',
    '^@libs/(.*)$': '<rootDir>/apps/libs/$1',
    '^@/common/(.*)$': '<rootDir>/apps/libs/common/$1',
    '^@/errors/(.*)$': '<rootDir>/apps/libs/errors/$1',
    '^@/constants/queue$': '<rootDir>/apps/libs/core/constants/queue.ts',
    '^@/constants/resolve-key/(.*)$': '<rootDir>/apps/libs/core/constants/resolve-key/$1',
    '^@/constants/(.*)$': '<rootDir>/apps/libs/constants/$1',
    '^@/(.*)$': '<rootDir>/apps/api/src/$1',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/apps/api/test/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/apps/api/test/tsconfig.spec.json' }],
  },
};
