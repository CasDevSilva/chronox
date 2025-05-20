import pkg from "better-sqlite3";

const Database = pkg;

export function connectDatabase(){
    let db = new Database("./db/chronox.db")

    return db;
}

function createTable(pStrTableName, pObjTableColumns) {
    let mArrColumns = []
    Object.keys(pObjTableColumns).forEach(mRowColumn => {
        mArrColumns.push(`${mRowColumn} ${pObjTableColumns[mRowColumn]}`)
    })

    try {
        let db = connectDatabase();

        let mStrSQLSentence = `
            CREATE TABLE IF NOT EXISTS ${pStrTableName} (
                ${mArrColumns.join(', ')}
            )
        `

        db.exec(mStrSQLSentence)

        db.close();
    } catch(err) {
        throw new Error("ERROR to Create the Tables")
    }
}

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

    Object.keys(mObjTables).forEach(mRowTable => createTable(mRowTable, mObjTables[mRowTable]))

    console.log("Init the Module")
}