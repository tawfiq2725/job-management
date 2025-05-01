import { Router } from "express";
import { JobCtrlDI } from "../containers/job.DI";
const route = Router();

route.get("/all-jobs", JobCtrlDI.getAllJob.bind(JobCtrlDI));
route.post("/create-job", JobCtrlDI.createNewJob.bind(JobCtrlDI));

export default route;
