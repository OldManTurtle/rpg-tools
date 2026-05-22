"use server";
import React from "react";
import { Suspense } from "react";
import { FileManager } from "./fetcher";
import { getCurrentFile } from "../api/fileshare/route";

const Signup = async () => {
  return (
    <Suspense fallback={"...Loading"}>
      <FileManager currentFile={getCurrentFile()} />
    </Suspense>
  );
};

export default Signup;
