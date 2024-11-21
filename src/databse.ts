import { Pool } from "pg";

export class Database {
    private user: string;
    private password?: string;
    private host: string;
    private port: number;
    private database: string;
    private pool: Pool = null as any; // a bit hacky but will do the trick

    /**
     * **DO NOT USE THIS CONSTRUCTOR DIRECTLY. USE `createDatabase` INSTEAD**
     */
    public constructor(user: string, password: string | undefined, host: string, port: number, database: string) {
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
        this.database = database;
    }

    protected init = async () => {
        this.pool = new Pool({
            user: this.user,
            password: this.password,
            host: this.host,
            port: this.port,
            database: this.database,
            allowExitOnIdle: false,
            idleTimeoutMillis: null
        });

        const promise = new Promise<void>((resolve, reject) => {
            this.pool.on("connect", () => resolve());
            this.pool.on("error", reject);
        });

        this.pool.connect();

        return promise;
    };

    public getUserName = () => this.user;
    public getHost = () => this.host;
    public getPort = () => this.port;
    public getDatabase = () => this.database;

    public getVersion = async () => {
        const query = await this.pool.query("select version() as version", []);
        return (query.rows[0].version as string).split(" ").slice(0, 2).join(" "); // e.g. "PostgreSQL 17.0"
    };

    public query = async (query: string, args: any[]) => await this.pool.query(query, args);

    public static async createDatabase(...args: ConstructorParameters<typeof Database>) {
        const db = new Database(...args);
        await db.init();
        return db;
    }

    public static parseURLString(urlString: string): ConstructorParameters<typeof Database> {
        const url = new URL(urlString);
        if (!url.protocol.startsWith("postgre")) throw new Error("Invalid URL protocol");
        return [url.username, url.password, url.hostname, Number(url.port), url.pathname.slice(1)];
    }
}