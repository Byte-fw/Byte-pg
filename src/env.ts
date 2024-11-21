export class EnvManager {
    public static getDebug = (): boolean | false => GetConvarInt("debug", 0) == 1;
    public static getConectionString = (): string | "none" => GetConvar("pg_connection_string", "none");
};