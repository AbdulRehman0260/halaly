import type {MigrationConfig} from 'drizzle-orm/migrator'; 

type Config = {
    api: APIConfig,
    db: DBConfig,
    jwt: JWTConfig
};

type APIConfig = 
{
    fileservers:number,
    port:number,
    secret:string
};

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig
};

type JWTConfig = {
    defaultDuration: number,
    secret: string,
    issuer:string
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
        port: Number(envVarOrThrow('PORT')),
        secret: envVarOrThrow("SECRET")

    },
    db:{
        url: envVarOrThrow('DB_URL'),
        migrationConfig: migrationConfig
    },
    jwt:{
        defaultDuration:60*60,
        secret:envVarOrThrow("SECRET"),
        issuer:"halaly"
    }
};
