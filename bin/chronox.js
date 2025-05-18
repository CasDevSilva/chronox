#!/usr/bin/env node
import * as Init from "../src/commands/init.js";
import * as Start from "../src/commands/start.js";
import * as Stop from "../src/commands/stop.js";
import * as Project from "../utils/projects.js";
import * as Sessions from "../utils/sessions.js";

let mArrProcess = process.argv.splice(2)

let mObjProcess = {
    "init"    : Init.init,
    "start"   : Start.start,
    "stop"    : Stop.stop,
    "list"    : Project.listProjects,
    "add"     : Project.addProject,
    "sessions": Sessions.viewSessions
};

if (Object.keys(mObjProcess).includes(mArrProcess[0])) {
    mObjProcess[mArrProcess[0]](mArrProcess.splice(1));
}