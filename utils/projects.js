import * as Database from "./database.js";
import Table from "cli-table3";
import dayjs from "dayjs";
import chalk from "chalk";

/**
 * Name: addProject
 *
 * Description: Add a new project to the database
 *
 * @param {Array}   pArrProject - Array of strings containing the name and alias of the project
*/
export function addProject(pArrParams) {
    if (pArrParams.length < 2) {
        console.log(chalk.red("Error, specify the name and alias of your project"))
    } else if (pArrParams.length > 2) {
        console.log(chalk.yellow("Error, only specify the name and alias of your project, not more"))
    } else {
        let mObjProject = {
            name        : pArrParams[0],
            alias       : pArrParams[1],
            status      : 'O',
            date_created: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }

        if (verifyExistProject([mObjProject.alias])){
            console.log(chalk.red("Error, the Alias already exists by referencing another project."))
        } else {
            try {
                const db = Database.connectDatabase();
                let mStrStatement = db.prepare(`
                    INSERT INTO projects (name, alias, status, date_created)
                    VALUES (:name, :alias, :status, :date_created)
                `)
                mStrStatement.run(mObjProject)

                db.close();

                console.log(chalk.green("Project successfully added"))
            } catch(err) {
                console.log(chalk.red("Error while adding the project"));
            }
        }
    }
}

/**
 * Name: listProjects
 *
 * Description: List all projects in the database
 *
 * @param {Array}   pArrParams - Array of strings containing the status of the projects to be listed
*/
export function listProjects(pArrParams) {
    if (pArrParams.length > 1) {
        console.log(chalk.red("Error, this instruction only have receive one param, note more"))
    }

    let mRsTable = new Table(
        {
            head: ["Alias code", "Name of Project", "Status", "Date created", "Date end"],
            colWidths: [30, 50, 30, 30, 30],
            compact: true,
            style: {
                head: ["cyan"],
                border: ["grey"]
            }
        }
    );

    try {
        const db = Database.connectDatabase();
        let mArrRows = null;

        if (pArrParams.length && ["-O", "-C"].includes(pArrParams[0])) {
            let mStrStatus = pArrParams[0] == "-O" ? "O" : "C";
            mArrRows = db.prepare(`SELECT * FROM projects WHERE status = ?`).all(mStrStatus);
        } else if (!pArrParams.length || pArrParams[0] == "-A") {
            mArrRows = db.prepare(`SELECT * FROM projects`).all();
        } else {
            console.log(chalk.red("Error, the parameter is not valid. Only use '-O', '-C', '-A' or not set a parameter."));
        }

        if(mArrRows.length > 0) {
            mArrRows.forEach(mRowProject => {
                mRsTable.push([
                    chalk.bold(mRowProject.alias),
                    mRowProject.name,
                    mRowProject.status == 'O' ? chalk.greenBright('Open'): chalk.gray("Completed"),
                    mRowProject.date_created,
                    mRowProject.date_end
                ])
            });

            console.log(mRsTable.toString());
        } else {
            console.log(chalk.yellow("No projects found"));
        }

        db.close();
    } catch(err) {
        console.log(chalk.red("Error obtaining project records"));
    }
}

/**
 * Name: verifyExistProject
 *
 * Description: Verify if a project exists in the database
 *
 * @param {Array}   pArrProject - Array of strings containing the alias of the project to be verified
*/
export function verifyExistProject(pArrParams) {
    /**
     * Evaluate the number of parameters
     * If the number of parameters is less than 1 or greater than 1, show an error message
    */
    if (pArrParams.length < 1) {
        console.log(chalk.red("Error verify, specify the alias of your project"))
    } else if (pArrParams.length > 1) {
        console.log(chalk.yellow("Error verify, only specify the alias of your project"))
    } else {
        /**
         * Check if the project exists in the database
        */
        let mStrAlias = pArrParams[0];

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
            console.log(chalk.red("Error verifying existence of Project"))
        }
    }
}

/**
 * Name: closeProject
 *
 * Description: Close a project, set status Completed and set current date
 *
 * @param {Array}   pArrProject - Array of strings containing the alias of the project to be closed
*/
export function closeProject(pArrParams) {
    /**
     * Evaluate the number of parameters
     * If the number of parameters is less than 1 or greater than 1, show an error message
    */
    if (pArrParams.length < 1) {
        console.log(chalk.red("Error, specify the alias of your project"))
    } else if (pArrParams.length > 1) {
        console.log(chalk.yellow("Error, only specify one alias project"))
    } else {
        let mStrAlias = pArrParams[0];

        try {
            const db = Database.connectDatabase();

            /**
             * Check if the project exists and is open
             * If the project doesn't exist or is closed, show an error message
             * Else update the project status and set date end
            */
            let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ? AND status = 'O'`).get(mStrAlias)

            if (!mObjProject) {
                console.log(chalk.yellow("Error, the project is already closed or does not exist"))
            } else {
                let mStrStatement = db.prepare(`
                    UPDATE projects
                        SET status   = 'C',
                            date_end = :date_end
                    WHERE id = :id
                `);

                mObjProject.date_end = dayjs().format('YYYY-MM-DD HH:mm:ss');
                mStrStatement.run(mObjProject)

                console.log(chalk.green(`Project "${mObjProject.name}" closed successfully`));
            }

            db.close();
        } catch(err) {
            console.log(chalk.red("Error when closing the project"))
        }
    }
}