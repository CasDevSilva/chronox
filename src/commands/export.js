import os from "os";
import path from "path";
import ExcelJS from 'exceljs';
import dayjs from "dayjs";
import fs from "fs";
import * as Database from "../../utils/database.js";
import chalk from "chalk";

const baseUrl = path.join(os.homedir(), ".chronox", "exports");

/**
 * Name: exportCsv
 *
 * Description: This function exports the projects and sessions to a CSV file.
 *
 * @param {Array} pArrParams - The parameters passed to the function.
*/
export async function exportCsv(pArrParams) {
    if (!fs.existsSync(baseUrl)) {
        fs.mkdirSync(baseUrl, { recursive: true });
    }

    /**
     * Check if the user passed more than one parameter
     * If so, return an error message
    */
    if (pArrParams.length > 1) {
        console.log(chalk.red("Error: Only one parameter is allowed, the project alias. Not more."));
        return;
    }

    try {
        /**
         * Connect to the database
         * Create a new workbook, create a sheets for projects and sessions
        */
        const db = Database.connectDatabase();

        let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(pArrParams[0]);
        if (!mObjProject) {
            console.log(chalk.yellow(`Error: Project with alias "${pArrParams[0]}" not found.`));
            return;
        }

        const workbook = new ExcelJS.Workbook();

        const mProjectsSheet = workbook.addWorksheet('Projects');
            mProjectsSheet.columns = [
                {header: "Project ID"   , key: "id"},
                {header: "Name"         , key: "name"},
                {header: "Alias"        , key: "alias"},
                {header: "Status"       , key: "status"},
                {header: "Date Created" , key: "date_created"},
                {header: "Date End"     , key: "date_end"}
            ];

            const mSessionsSheet = workbook.addWorksheet('Sessions');
            mSessionsSheet.columns = [
                { header: 'Session ID'  , key: 'id' },
                { header: 'Project'     , key: 'project_id' },
                { header: 'Start'       , key: 'date_start' },
                { header: 'End'         , key: 'date_end' },
                { header: 'Duration'    , key: 'duration' }
            ];

        let mRsProjects = null;
        let mRsSessions = null;
        mObjProject = null;

        /**
         * Check if the user set a project alias to filters the projects and sessions.
         * Then, add information to the sheets.
         * Finally, write the file to the disk.
         *
         * Inform the user the path where the file was created.
        */
        if (pArrParams.length == 0) {
            mRsProjects = db.prepare(`SELECT * FROM projects`).all()
            mRsSessions = db.prepare(`SELECT * FROM sessions ORDER BY project_id`).all();
        } else {
            mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(...arguments[0])
            mRsSessions = db.prepare(`
                SELECT sessions.*
                FROM sessions
                    JOIN projects ON projects.id = sessions.project_id
                WHERE
                    alias = ?
            `).all(...arguments[0]);
        }

        if (Array.isArray(mRsProjects)) {mProjectsSheet.addRows(mRsProjects)}
        if (Array.isArray(mRsSessions)) {mSessionsSheet.addRows(mRsSessions)}
        if (mObjProject) {mProjectsSheet.addRow(mObjProject)}

        let mStrFullPath = pArrParams.length == 0
            ? path.join(baseUrl, `report_chronox_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`)
            : path.join(baseUrl, `report_chronox_${mObjProject.alias}_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`);
        let mStrMidPath = pArrParams.length == 0
            ? path.join("~", ".chronox", "exports",`report_chronox_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`)
            : path.join("~", ".chronox", "exports",`report_chronox_${mObjProject.alias}_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`);

        await workbook.xlsx.writeFile(mStrFullPath);
        console.log(chalk.green(`File Created in: "${mStrMidPath}"`))

        db.close();
    } catch(err) {
        console.log(chalk.red(`Error generating Csv file`))
    }
}