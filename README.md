# Byte-pg
Minimal wrapper for PostgreSQL designed for the [Byte framework](https://github.com/JaRoloz/Byte)
This project is still in **WIP** and will remain like so for a long time until the Byte framework reaches a *stable* release.

## Building
This project uses [bun](https://bun.sh) and [jade](https://github.com/JaRoloz/jade) for the build process. Once both of those dependencies are installed, simply `cd` into the project directory and run `jade .`.

## Setup
Add the convar `pg_connection_string` containing your PostgreSQL connection string into `the server.cfg`.
Here is an example on how that would look like:
```
set pg_connection_string "postgres://user:password@localhost:5432/database"
```