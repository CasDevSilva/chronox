import * as Database from "../../utils/database.js";
import * as Session from "../../utils/sessions.js";
import dayjs from "dayjs";

export function stop() {
    let mObjUpdSession = {
        date_end: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };

    let mObjSession = Session.getCurrentSession();

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

            console.log(`Pause project "${mObjSession.name}" session`);
        } catch (err) {
            console.log("Error pausing current session")
        }
    } else {
        console.log("No active sessions")
    }
}