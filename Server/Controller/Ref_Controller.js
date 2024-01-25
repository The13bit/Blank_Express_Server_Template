/**
 * -----------------------------------------------------------------------------
 * WARNING: This code base is obsolete and is only for reference purposes.
 * Please do not use this for any active development.
 * -----------------------------------------------------------------------------
 */

import fs from "fs";
import os from "os";
import { catchAsyncError } from "../middleware/CatchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

import { Result } from "../Models/Ref_Model1.js";
import getDataUri from "../utils/Datauri.js";
import csvtojson from "csvtojson";
import json2csv from "json2csv";
import { PythonShell } from "python-shell";
import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploaddataset = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("Please upload a file", 400));
  }
  const fileuri = getDataUri(file);

  let json;
  if (file.mimetype === "text/csv") {
    const decoded_file = Buffer.from(fileuri.base64, "base64").toString(
      "utf-8"
    );
    json = await csvtojson().fromString(decoded_file);
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    const workbook = xlsx.read(fileuri.base64, { type: "base64" });
    const sheet_name_list = workbook.SheetNames;
    json = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  } else {
    return next(new ErrorHandler("Unsupported file type", 400));
  }

  for (const arr of json) {
    const duplicate = await Result.findOne({
      xie_id: arr.xie_id,
      exam_type: arr.exam_type,
      sem: arr.sem,
      year: arr.year,
      Subject: arr.Subject,
    });
    if (!duplicate) {
      Result.create(arr);
    } else {
      console.log(` ${JSON.stringify(arr)} already exists`);
      continue;
    }
  }

  res.json({ success: true, message: "Collection uploaded successfully" });
});

export const deletcollection = catchAsyncError(async (req, res, next) => {
  await Result.deleteMany({});
  res.json({ success: true, message: "Collection deleted successfully" });
});

export const getallresults = catchAsyncError(async (req, res, next) => {
  const { year, sem, branch } = req.body;
  console.log(year, sem, branch);
  const results = await Result.find({ year: year, sem: sem, branch: branch });
  res.json({ success: true, results });
});

export const Allres = catchAsyncError(async (req, res, next) => {
  const results = await Result.find({});
  res.json(results);
});

export const Resultprocess = catchAsyncError(async (req, res, next) => {
  const { xie_id, year, sem } = req.body;

  if (!xie_id || !year || !sem) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const results = await Result.find({ xie_id, year, sem });
  const fields = [
    "xie_id",
    "name",
    "branch",
    "year",
    "sem",
    "exam_type",
    "Maths_3",
    "DSA",
    "Java",
    "CG",
    "DSGT",
    "DLCOA",
  ];
  console.log(results);
  res.send(results);

  //const csv = json2csv.parse(results, { fields });
  //
  // Create a temporary file path
  //const tempFilePath = path.join(os.tmpdir(), "temp.csv");
  //
  // Write the CSV data to the temporary file
  //fs.writeFileSync(tempFilePath, csv);
  //
  //let options = {
  //    mode: "text",
  //    pythonOptions: ["-u"],
  //    scriptPath: path.join(__dirname, "../Scripts"),
  //    args: [tempFilePath],
  //};
  //
  //const data = await PythonShell.run("second_script.py", options);
  //
  // Delete the temporary file
  //fs.unlinkSync(tempFilePath);
  //
  //res.send(data);
});

export const UpdateOptions = catchAsyncError(async (req, res, next) => {
  const uniqueYears = await Result.aggregate([
    {
      $group: {
        _id: { year: "$year", branch: "$branch", sem: "$sem" },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        branch: "$_id.branch",
        sem: "$_id.sem",
        count: 1,
      },
    },
  ]);
  res.send(uniqueYears);
});

export const authcheck = catchAsyncError(async (req, res, next) => {
  res.send({ success: true, message: "Authenticated" });
});
