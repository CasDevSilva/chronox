import pkg from "better-sqlite3";
import chalk from "chalk";

const Database = pkg;

/**
 * Name: connectDatabase
 *
 * Description: This function is used to connect to the database.
 *
 * Return: It returns the database connection.
*/
export function connectDatabase(){
    let db = new Database("./db/chronox.db");
    return db;
}

/**
 * Name: createTable
 *
 * Description: This function is used to create a table in the database.
 *
 * @params {String} pStrTableName - The name of the table to be created.
 * @params {Object} pObjTableColumns - The columns of the table to be created.
*/
function createTable(pStrTableName, pObjTableColumns) {
    let mArrColumns = [];
    Object.keys(pObjTableColumns).forEach(mRowColumn => {
        mArrColumns.push(`${mRowColumn} ${pObjTableColumns[mRowColumn]}`);
    })

    try {
        let db = connectDatabase();

        let mStrSQLSentence = `
            CREATE TABLE IF NOT EXISTS ${pStrTableName} (
                ${mArrColumns.join(', ')}
            )
        `;

        db.exec(mStrSQLSentence);
        db.close();
    } catch(err) {
        throw new Error("ERROR to Create the Tables");
    }
}

/**
 * Name: syncDatabase
 *
 * Description: This function is used to synchronize the database.
*/
export function syncDatabase() {
    let mObjTables = {
        projects: {
            id          : "INTEGER PRIMARY KEY AUTOINCREMENT",
            name        : "VARCHAR(50) NOT NULL",
            alias       : "VARCHAR(20) NOT NULL UNIQUE",
            status      : "CHAR(1) NOT NULL",
            rate        : "INTEGER",
            date_created: "DATE NOT NULL",
            date_end    : "DATE"
        },
        sessions: {
            id          : "INTEGER PRIMARY KEY AUTOINCREMENT",
            project_id  : "INTEGER NOT NULL",
            date_start  : "DATE NOT NULL",
            date_end    : "DATE",
            duration    : "INTEGER"
        }
    }

    Object.keys(mObjTables).forEach(mRowTable => createTable(mRowTable, mObjTables[mRowTable]));
    console.log(chalk.green("Init the Module"));
}