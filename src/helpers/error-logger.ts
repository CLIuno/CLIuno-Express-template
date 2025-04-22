import fs from "fs";
import path from "path";

const logFilePath = path.join(__dirname, "../../logs/error.log");
const logDir = path.dirname(logFilePath);

export default function logThisError(error: any) {
    const errorMessage = `${new Date().toISOString()} - ${
        typeof error === "object" ? JSON.stringify(error, null, 2) : error
    }\n`;

    // Check if the log directory exists, if not create it
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    // Check if the log file exists, if not create it
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "");
    }

    fs.appendFileSync(logFilePath, errorMessage);
}
