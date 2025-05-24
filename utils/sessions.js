import * as Database from "./database.js";
import Table from "cli-table3";
import chalk from "chalk";

/**
 * Name: viewSessions
 *
 * Description: This function is used to view the sessions of a project.
 *
 * @param {Array} pArrParams - The parameters passed to the function.
*/
export function viewSessions(pArrParams) {
    /**
     * Check if the user has passed only one param(project alias), not more.
    */
    if (pArrParams.length > 1) {
        console.log(chalk.red("Only refer an alias a project, not more"));
        return;
    }

    try {
        /**
         * Create a condition to filter the sessions by project alias.
         * If the user has not passed any params, the condition will be 1 = 1.
        */
        const db = Database.connectDatabase()

        let mStrSQLCond = pArrParams.length ? `projects.alias = '${pArrParams[0]}'`: `1 = 1`;
        let mArrSessions = db.prepare(`
            SELECT
                projects.name,
                sessions.date_start,
                sessions.date_end,
                sessions.duration
            FROM sessions
            JOIN projects ON sessions.project_id = projects.id
            WHERE ${mStrSQLCond}
            ORDER BY sessions.date_start DESC
        `).all()

        /**
         * If get registered sessions, show them in a table.
         * If not, show a message.
        */
        if (mArrSessions.length) {

            let mRsSessions = new Table({
                head: ["Project Name", "Date Start", "Date End", "Duration"],
                colWidths: [50, 30, 30, 30],
                compact: true,
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
                    chalk.yellowBright(mRowSession.duration)
                ])
            })

            console.log(mRsSessions.toString());
        } else {
            console.log(chalk.yellow("There are no session logs"));
        }

        db.close();
    } catch(err) {
        console.log(chalk.red("Error obtaining sessions"))
    }
}

/**
 * Name: getCurrentSession
 *
 * Description: This function is used to get the current session of a project.
 *
 * @returns {Object} - The current session of a project.
*/
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
        console.log(chalk.red("Error verifying session in progress"))
    }
}