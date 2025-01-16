import express from "express";
import {getAllDesignations} from "../controllers/designation.controller.js";

const router = express.Router()

router.get('/getAllDesignations', getAllDesignations );

export default router;