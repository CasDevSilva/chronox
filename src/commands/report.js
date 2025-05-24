import * as Database from "../../utils/database.js";
import Table from "cli-table3";
import chalk from "chalk";

/**
 * Name: reportProjects
 *
 * Description: This function is used to report the time of a project or all projects.
 *
 * @params {Array} pArrParams - Array of parameters passed to the function.
*/
export function reportProjects(pArrParams) {
    /**
     * Check if the user has passed only one param(project alias), not more.
    */
    if (pArrParams.length > 1) {
        console.log(chalk.red("Only refer an alias a project, not more"));
        return;
    }

    try {
        const db = Database.connectDatabase();
        let mArrTtlSessions = null;

        /**
         * Based on the number of params, get the sessions of the project or all projects.
        */
        if (pArrParams.length == 0) {
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
        }

        /**
         * Validate if the query returned a result
         * If not, show a message
        */
        if (Array.isArray(mArrTtlSessions) && mArrTtlSessions.length > 0) {
            let mRsTable = new Table({
                head: ["Alias", "Name of Project", "Rate", "Date Start", "Date End", "Duration", "Cost"],
                colWidths: [20, 40, 20, 30, 30, 20, 20],
                style: {
                    head: ["cyan"],
                    border: ["grey"]
                }
            })

            mArrTtlSessions.forEach(mRowSession => {
                mRsTable.push([
                    chalk.bold(mRowSession.alias),
                    mRowSession.name,
                    chalk.blue(mRowSession.rate),
                    mRowSession.date_start,
                    mRowSession.date_end,
                    mRowSession.duration,
                    chalk.greenBright((mRowSession.duration/3600 * mRowSession.rate).toFixed(2))
                    ]
                )
            })

            console.log(mRsTable.toString());
        } else {
            console.log(chalk.yellow("No records found to create the report"));
        }

        db.close();
    } catch (err) {
        console.log(chalk.red("Error while compiling the time of the project(s)"));
    }
}