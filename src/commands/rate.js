import * as Database from "../../utils/database.js";

export function rateProject() {
    if (
        ([...arguments].length &&
        (Array.isArray(arguments[0]) && arguments[0].length == 0)) ||
        [...arguments].length == 0
    ) {
        console.log("Define the cost and alias of the project");
    } else {
        // let mArrArgs = [...arguments];
        // console.log(mArrArgs)
        if ([...arguments][0].length > 2 || [...arguments][0].length < 2) {
            console.log("Define parameters in order (project alias, cost per hour)")
        } else {
            let mObjProject = {
                alias: arguments[0][0],
                rate: Number.parseFloat(arguments[0][1])
            }

            try {
                const db = Database.connectDatabase();

                let mStrStatement = db.prepare(`UPDATE projects SET rate = :rate WHERE alias = :alias`);
                mStrStatement.run(mObjProject)

                db.close();
            } catch(err) {
                console.log("Error in defining the hourly cost of the project");
            }
        }
    }
}