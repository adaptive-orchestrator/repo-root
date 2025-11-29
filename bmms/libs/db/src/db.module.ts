import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export interface DbModuleOptions {
  prefix: string; // Prefix cho env variables (vd: CUSTOMER_SVC, ORDER_SVC)
}

@Module({})
export class DbModule {
  static forRoot(options: DbModuleOptions): DynamicModule {
    const { prefix } = options;
    
    return {
      module: DbModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            // Tạo key với prefix: CUSTOMER_SVC_DB_HOST, ORDER_SVC_DB_HOST, ...
            const host = configService.get(`${prefix}_DB_HOST`);
            const port = configService.get(`${prefix}_DB_PORT`);
            const username = configService.get(`${prefix}_DB_USER`);
            const password = configService.get(`${prefix}_DB_PASS`);
            const database = configService.get(`${prefix}_DB_NAME`);
            
            console.log(`🔍 DB Config for [${prefix}]:`);
            console.log('Host:', host);
            console.log('Port:', port);
            console.log('User:', username);
            console.log('Database:', database);
            
            // Validate required fields
            if (!host || !username || !password || !database) {
              throw new Error(
                `Missing database configuration for ${prefix}. ` +
                `Please check your .env file for: ${prefix}_DB_HOST, ${prefix}_DB_USER, ${prefix}_DB_PASS, ${prefix}_DB_NAME`
              );
            }
            
            return {
              type: 'mysql' as const,
              host,
              port: parseInt(port || '3306', 10),
              username,
              password,
              database,
              autoLoadEntities: true,
              synchronize: true, // ⚠️ CHỈ dùng trong development, tắt đi ở production!
              logging: false, // 🚀 Disable logging for performance
              // 🚀 Connection Pool Optimization (Round 2)
              extra: {
                connectionLimit: 100,       // Tăng từ 50 lên 100
                waitForConnections: true,
                queueLimit: 200,           // Tăng từ 100 lên 200
                enableKeepAlive: true,
                keepAliveInitialDelay: 10000,
                acquireTimeout: 60000,     // 60s timeout
                timeout: 60000,
                maxIdle: 50,               // Keep 50 idle connections ready
                idleTimeout: 60000,
              },
              // 🚀 Query Cache (Extended)
              cache: {
                duration: 60000, // Cache queries 60 seconds
              },
              // 🚀 Retry Strategy
              retryAttempts: 3,
              retryDelay: 1000,
            };
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}