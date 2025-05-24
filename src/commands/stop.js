import * as Database from "../../utils/database.js";
import * as Session from "../../utils/sessions.js";
import dayjs from "dayjs";
import chalk from "chalk";

/**
 * Name: stop
 *
 * Description: This function is used to stop the current session of a project.
 */
export function stop(pArrParams) {
    if(pArrParams.length > 0) {
        console.log(chalk.red("This command does not accept parameters"));
        return;
    }

    /**
     * Get the current session of a project
     * And set the date_end to update the session
    */
    let mObjUpdSession = {
        date_end: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };

    let mObjSession = Session.getCurrentSession();

    /**
     * If receive a session, update the session
     * Else, show a message
    */
    if (mObjSession) {
        mObjUpdSession.id = mObjSession.id;

        let mDateStart = dayjs(mObjSession.date_start)
        let mDateEnd = dayjs(mObjUpdSession.date_end)

        mObjUpdSession.duration = mDateEnd.diff(mDateStart, 'second');

        try{
            const db = Database.connectDatabase();

            let mStrStatement = db.prepare(`
                UPDATE sessions
                SET date_end = :date_end,
                    duration = :duration
                WHERE id = :id
            `)

            mStrStatement.run(mObjUpdSession)

            db.close();

            console.log(chalk.green(`Pause project "${mObjSession.name}" session`));
        } catch (err) {
            console.log(chalk.red("Error pausing current session"))
        }
    } else {
        console.log(chalk.yellow("No active sessions"))
    }
}