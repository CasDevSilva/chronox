import * as Database from "../../utils/database.js"

export function init(){
    Database.syncDatabase();
}