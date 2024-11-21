import "@citizenfx/server";
import { Database } from "./databse";
import { EnvManager } from "./env";

let db: Database;
let error: string;

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
        console.error(`^1Failed to connect to PostgreSQL: ${e.message || "An unknown error occurred"}^0`);
        error = e.message || "An unknown error occurred";
        TriggerEvent("byte-pg:server:connected", error);
    }
})();

exports("Ready", (cb: Function) => setImmediate(() => {
    if (db || error) return cb(error);
    AddEventHandler("byte-pg:server:connected", (err: string) => cb(err));
}));

exports("Query", (query: string, args: any[], cb: Function) => {
    db.query(query, args).then(result => {
        cb([result.rows, result.rowCount, null]);
    }).catch(e => {
        cb([[], 0, e.message || "An unknown error occurred"]);
    });
});
