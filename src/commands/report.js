import * as Database from "../../utils/database.js";
import Table from "cli-table3";

export function reportProjects() {
    try {
        const db = Database.connectDatabase();
        let mArrTtlSessions = null;

        if (
            ([...arguments].length &&
            (Array.isArray(arguments[0]) && arguments[0].length == 0)) ||
            [...arguments].length == 0
        ) {
            mArrTtlSessions = db.prepare(`
                SELECT
                    projects.alias,
                    projects.name,
                    projects.rate,
                    MIN(sessions.date_start) date_start,
                    MAX(sessions.date_end) date_end,
                    SUM(sessions.duration) duration
                FROM projects
                JOIN sessions
                    ON projects.id = sessions.project_id
                GROUP BY 1, 2
                ORDER BY 5 DESC
            `).all();
        } else {
            if ([...arguments].length == 1) {
                mArrTtlSessions = [db.prepare(`
                    SELECT
                        projects.alias,
                        projects.name,
                        projects.rate,
                        MIN(sessions.date_start) date_start,
                        MAX(sessions.date_end) date_end,
                        SUM(sessions.duration) duration
                    FROM projects
                    JOIN sessions
                        ON projects.id = sessions.project_id
                    WHERE
                        projects.alias = ?
                    GROUP BY 1, 2
                    ORDER BY 5 DESC
                `).get(...arguments[0])];
            } else {
                console.log("Error only requests the total of a project, not more.");
            }
        }

        if (Array.isArray(mArrTtlSessions)) {
            let mRsTable = new Table({
                head: ["Alias", "Name of Project", "Rate", "Date Start", "Date End", "Duration", "Cost"],
                colWidths: [30, 50, 30, 30, 30, 30, 30],
                style: {
                    head: ["cyan"],
                    border: ["grey"]
                }
            })

            mArrTtlSessions.forEach(mRowSession => {
                mRsTable.push([
                    mRowSession.alias,
                    mRowSession.name,
                    mRowSession.rate,
                    mRowSession.date_start,
                    mRowSession.date_end,
                    mRowSession.duration,
                    (mRowSession.duration/3600 * mRowSession.rate).toFixed(2)
                    ]
                )
            })

            console.log(mRsTable.toString());
        } else {
            console.log("Error when generating the time average");
        }

        db.close();

    } catch (err) {
        console.log("Error while compiling the time of the project(s)");
    }
}