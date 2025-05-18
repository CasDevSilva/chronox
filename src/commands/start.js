import * as Database from "../../utils/database.js";
import * as Projects from "../../utils/projects.js";
import dayjs from "dayjs";

export function start (pArrProject) {
    if (pArrProject.length > 1 || pArrProject.length < 1) {
        console.log("Error, only specify the alias of your project")
    } else {
        let mStrAliasProject = pArrProject[0];

        if (Projects.verifyExistProject([mStrAliasProject])){
            try {
                const db = Database.connectDatabase();

                let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(mStrAliasProject);
                let mObjSession = {
                    project_id: mObjProject.id,
                    date_start: dayjs().format('YYYY-MM-DD HH:mm:ss')
                };

                let mStrStatement = db.prepare(`
                    INSERT INTO sessions(project_id, date_start)
                    VALUES (:project_id, :date_start)
                `);

                mStrStatement.run(mObjSession);

                db.close();

                console.log(`Logging into the project "${mObjProject.name}"`);
            } catch(err) {
                console.log("Error logging into the project")
            }
        } else {
            console.log("Error, the provided alias does not refer to existing projects.")
        }
    }
}