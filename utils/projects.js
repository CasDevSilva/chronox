import * as Database from "./database.js";
import Table from "cli-table3";
import dayjs from "dayjs";

export function addProject(pArrProject) {
    if(pArrProject.length > 2 || pArrProject.length < 2) {
        console.log("Error, specify the name and alias of your project")
    } else {
        let mObjProject = {
            name        : pArrProject[0],
            alias       : pArrProject[1],
            status      : 'O',
            date_created: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }

        if (verifyExistProject([mObjProject.alias])){
            console.log("Error, the Alias already exists by referencing another project.")
        } else {
            try {
                const db = Database.connectDatabase();

                let mStrStatement = db.prepare(`
                    INSERT INTO projects (name, alias, status, date_created)
                    VALUES (:name, :alias, :status, :date_created)
                `)

                mStrStatement.run(mObjProject)

                db.close();

                console.log("Project successfully added")
            } catch(err) {
                console.log("Error while adding the project");
            }
        }
    }
}

export function listProjects() {
    if ([...arguments].length && (Array.isArray(arguments[0]) && arguments[0].length > 0)) {
        console.log("Error, this instruction does not require parameters")
    } else {
        let mRsTable = new Table(
            {
                head: ["Alias code", "Name of Project", "Status", "Date created", "Date end"],
                colWidths: [30, 50, 30, 30, 30],
                style: {
                    head: ["cyan"],
                    border: ["grey"]
                }
            }
        );

        try {
            const db = Database.connectDatabase();
            let mArrRows = db.prepare(`SELECT * FROM projects`).all();

            if(mArrRows.length > 0) {
                mArrRows.forEach(mRowProject => {
                    mRsTable.push([
                        mRowProject.alias,
                        mRowProject.name,
                        mRowProject.status == 'O' ? 'Open': "Completed",
                        mRowProject.date_created,
                        mRowProject.date_end
                    ])
                });

                console.log(mRsTable.toString());
            } else {
                console.log("No projects found");
            }

            db.close();
        } catch(err) {
            console.log("Error obtaining project records");
        }
    }
}

export function verifyExistProject(pArrProject) {
    if (pArrProject.length > 1 || pArrProject.length < 1) {
        console.log("Error, specify the alias of your project")
    } else {
        let mStrAlias = pArrProject[0];

        try {
            const db = Database.connectDatabase();

            let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(mStrAlias)

            db.close();

            if (mObjProject) {
                return mObjProject.alias ? true: false;
            } else {
                return false;
            }
        } catch(err) {
            console.log("Error verifying existence of Project")
        }
    }
}

export function closeProject(pArrProject) {
    if (pArrProject.length > 1 || pArrProject.length < 1) {
        console.log("Error, specify the alias of your project")
    } else {
        let mStrAlias = pArrProject[0];

        try {
            const db = Database.connectDatabase();

            let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(mStrAlias)

            let mStrStatement = db.prepare(`
                UPDATE projects
                    SET status = 'C'
                WHERE id = :id
            `);

            mStrStatement.run(mObjProject)

            db.close();
        } catch(err) {
            console.log("Error when closing the project")
        }
    }
}