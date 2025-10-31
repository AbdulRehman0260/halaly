import type {MigrationConfig} from 'drizzle-orm/migrator'; 

type Config = {
    api: APIConfig,
    db: DBConfig
};

type APIConfig = 
{
    fileservers:number,
    port:number
};

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig
};

process.loadEnvFile();

function envVarOrThrow(varName: string): string {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`Missing environment variable: ${varName}`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: './src/db/migrations'
};


export const config: Config = {
    api:{
        fileservers: 0,
        port: Number(envVarOrThrow('PORT'))
    },
    db:{
        url: envVarOrThrow('DB_URL'),
        migrationConfig: migrationConfig
    }
};
