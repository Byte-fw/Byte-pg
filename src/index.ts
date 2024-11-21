import "@citizenfx/server";
import { Database } from "./databse";
import { EnvManager } from "./env";

let db: Database;

(async () => {
    const connectionString = EnvManager.getConectionString();

    try {
        if (connectionString === "none") {
            throw new Error("No connection string provided");
        }
    
        const params = Database.parseURLString(connectionString)
        db = await Database.createDatabase(...params);
        TriggerEvent("byte-pg:server:connected", null);
        console.log(`^2Connected to PostgreSQL [${await db.getVersion()}]^0`);
    } catch (e: any) {
        TriggerEvent("byte-pg:server:connected", e.message || "An unknown error occurred");
    }
})();

exports("Ready", (cb: Function) => {
    if (db) return cb();
    AddEventHandler("byte-pg:server:connected", (err: string) => cb(err));
});

exports("Query", (query: string, args: any[], cb: Function) => {
    db.query(query, args).then(result => {
        cb([result.rows, result.rowCount, null]);
    }).catch(e => {
        cb([[], 0, e.message || "An unknown error occurred"]);
    });
});
