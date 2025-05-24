import * as Database from "../../utils/database.js";
import dayjs from "dayjs";
import chalk from "chalk";

/**
 * Name: start
 *
 * Description: This function starts a session for a project.
 *
 * @param {Array} pArrProject - The alias of the project to start a session for.
*/
export function start (pArrProject) {
    /**
     * Check if the user provided a project alias
     * If have more than one project alias, show error
     * Else validate actions
    */
    if (pArrProject.length < 1) {
        console.log(chalk.red("Error, specify the alias of your project"))
    } else if (pArrProject.length > 1) {
        console.log(chalk.red("Error, only specify the alias of your project"))
    } else {
        let mStrAliasProject = pArrProject[0];

        /**
         * Validate if the project exists and is open, else show error
         * Validate if the project has a session running. If have one show error.
         * Else validate if exists anothe session open then show an error, else create a new session
        */
        try {
            const db = Database.connectDatabase();

            let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ? AND status = 'O'`).get(mStrAliasProject);

            if (mObjProject) {
                let mObjActiveSession = db.prepare(`SELECT * FROM sessions WHERE project_id = ? AND date_end IS NULL`).get(mObjProject.id);
                if (mObjActiveSession) {
                    console.log(chalk.yellow("Error, the project is already have a session running"));
                    return;
                } else {
                    let mObjActiveSessions = db.prepare(`SELECT * FROM sessions WHERE date_end IS NULL`).get();

                    if (mObjActiveSessions) {
                        console.log(chalk.yellow("Error, you already have a session running"));
                        return;
                    } else {
                        let mObjSession = {
                            project_id: mObjProject.id,
                            date_start: dayjs().format('YYYY-MM-DD HH:mm:ss')
                        };

                        let mStrStatement = db.prepare(`
                            INSERT INTO sessions(project_id, date_start)
                            VALUES (:project_id, :date_start)
                        `);

                        mStrStatement.run(mObjSession);
                    }

                }
            } else {
                console.log(chalk.red("Error, the provided alias does not refer open project"))
                return;
            }

            db.close();

            console.log(chalk.green(`Logging into the project "${mObjProject.name}"`));
        } catch(err) {
            console.log(chalk.red("Error logging into the project"))
        }
    }
}