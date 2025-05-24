import * as Database from "../../utils/database.js";
import chalk from "chalk";

/**
 * Name: rateProject
 *
 * Description: This function updates the hourly rate of a project in the database.
 *
 * @param {Array} pArrParams - The parameters passed to the function.
*/
export function rateProject(pArrParams) {
    /**
     * Check if the user passed more than one parameter
     * If so, return an error message
    */
    if (pArrParams.length == 0) {
        console.log(chalk.red("Define the alias and cost of the project"));
    } else {
        /**
         * Validate only recieive two parameters
         * Then verify if the alias is already registered
         * Finally update the project with the new rate
         *
         * Else return an error message
        */
        if (pArrParams.length > 2 || pArrParams.length < 2) {
            console.log(chalk.red("Define parameters in order (project alias, cost per hour)"))
        } else {
            let mObjProject = {
                alias: pArrParams[0],
                rate: Number.parseFloat(pArrParams[1])
            }

            try {
                const db = Database.connectDatabase();
                let mObjExistence = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(mObjProject.alias);

                if (!mObjExistence){
                    console.log(chalk.red(`Error: Project with alias "${mObjProject.alias}" not found.`));
                    return;
                }

                let mStrStatement = db.prepare(`UPDATE projects SET rate = :rate WHERE alias = :alias`);
                mStrStatement.run(mObjProject)

                db.close();

                console.log(chalk.green(`The hourly cost of the project "${mObjProject.alias}" was updated to $${mObjProject.rate}`));
            } catch(err) {
                console.log(chalk.red("Error in defining the hourly cost of the project"));
            }
        }
    }
}