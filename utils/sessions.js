import * as Database from "./database.js";
import Table from "cli-table3";

export function viewSessions() {
    try {
        const db = Database.connectDatabase()
        let mArrSessions = db.prepare(`
            SELECT
                projects.name,
                sessions.date_start,
                sessions.date_end,
                sessions.duration
            FROM sessions
            JOIN projects ON sessions.project_id = projects.id
            ORDER BY sessions.date_start DESC
        `).all()

        if (mArrSessions.length) {

            let mRsSessions = new Table({
                head: ["Project Name", "Date Start", "Date End", "Duration"],
                colWidths: [50, 30, 30, 30],
                style: {
                    head: ["cyan"],
                    border: ["grey"]
                }
            })

            mArrSessions.forEach(mRowSession => {
                mRsSessions.push([
                    mRowSession.name,
                    mRowSession.date_start,
                    mRowSession.date_end,
                    mRowSession.duration
                ])
            })

            console.log(mRsSessions.toString());
        } else {
            console.log("There are no session logs");
        }

        db.close();
    } catch(err) {
        console.log("Error obtaining sessions")
    }
}

export function getCurrentSession() {
    try{
        const db = Database.connectDatabase();

        let mObjSession = db.prepare(`
            SELECT
                projects.name,
                sessions.id,
                sessions.date_start,
                sessions.date_end,
                sessions.duration
            FROM sessions
            JOIN projects ON sessions.project_id = projects.id
            WHERE
                    sessions.date_end IS NULL
                AND sessions.date_start IS NOT NULL
        `).get()

        db.close();

        return mObjSession;
    } catch(err) {
        console.log("Error verifying session in progress")
    }
}