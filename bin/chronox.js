#!/usr/bin/env node
import * as Init from "../src/commands/init.js";
import * as Start from "../src/commands/start.js";
import * as Stop from "../src/commands/stop.js";
import * as Project from "../utils/projects.js";
import * as Sessions from "../utils/sessions.js";
import * as Report from "../src/commands/report.js";
import * as Export from "../src/commands/export.js";
import * as Rate from "../src/commands/rate.js";

let mArrProcess = process.argv.splice(2)

let mObjProcess = {
    "init"    : Init.init,
    "add"     : Project.addProject,
    "close"   : Project.closeProject,
    "list"    : Project.listProjects,
    "start"   : Start.start,
    "sessions": Sessions.viewSessions,
    "stop"    : Stop.stop,
    "report"  : Report.reportProjects,
    "export"  : Export.exportCsv,
    "set-rate": Rate.rateProject
};

if (Object.keys(mObjProcess).includes(mArrProcess[0])) {
    mObjProcess[mArrProcess[0]](mArrProcess.splice(1));
}