import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    entities: ["src/entities/*.ts"],
    logging: false,
    synchronize: true,
});

// Establish database connection
export const initializeDataSource = async () => {
    try {
        await myDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error during Data Source initialization:", err);
    }
};
