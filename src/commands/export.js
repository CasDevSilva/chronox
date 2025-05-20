import os from "os";
import path from "path";
import ExcelJS from 'exceljs';
import dayjs from "dayjs";
import fs from "fs";
import * as Database from "../../utils/database.js";

const baseUrl = path.join(os.homedir(), ".chronox", "exports");

export async function exportCsv() {
    if (!fs.existsSync(baseUrl)) {
        fs.mkdirSync(baseUrl, { recursive: true });
    }

    try {
        const db = Database.connectDatabase();
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

        if (
            ([...arguments].length &&
            (Array.isArray(arguments[0]) && arguments[0].length == 0)) ||
            [...arguments].length == 0
        ) {
            let mRsProjects = db.prepare(`SELECT * FROM projects`).all()
            let mRsSessions = db.prepare(`SELECT * FROM sessions ORDER BY project_id`).all();

            if(Array.isArray(mRsProjects)){mProjectsSheet.addRows(mRsProjects)}
            if(Array.isArray(mRsSessions)){mSessionsSheet.addRows(mRsSessions)}

            let mStrFullPath = path.join(baseUrl, `report_chronox_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`)
            let mStrMidPath = path.join("~", ".chronox", "exports",`report_chronox_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`)

            await workbook.xlsx.writeFile(mStrFullPath);

            console.log(`File Created in: "${mStrMidPath}"`)
        } else {
            if ([...arguments].length == 1) {
                let mObjProject = db.prepare(`SELECT * FROM projects WHERE alias = ?`).get(...arguments[0])
                let mRsSessions = db.prepare(`
                    SELECT sessions.*
                    FROM sessions
                        JOIN projects ON projects.id = sessions.project_id
                    WHERE
                        alias = ?
                `).all(...arguments[0]);

                if (mObjProject) {mProjectsSheet.addRow(mObjProject)}
                if (Array.isArray(mRsSessions)) {mSessionsSheet.addRows(mRsSessions)}

                let mStrFullPath = path.join(baseUrl, `report_chronox_${mObjProject.alias}_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`)
                let mStrMidPath = path.join("~", ".chronox", "exports",`report_chronox_${mObjProject.alias}_${dayjs().format("DD_MM_YYYY(HH_mm_ss)")}.xlsx`);

                await workbook.xlsx.writeFile(mStrFullPath);

                console.log(`File Created in: "${mStrMidPath}"`)
            } else {
                console.log("Error only requests the total of a project, not more.");
            }
        }

        db.close();
    } catch(err) {
        console.log(`Error generating Csv file`)
    }
}