"use server";
import React from "react";
import { Suspense } from "react";
import { FileManager } from "./fetcher";
import { getCurrentFileName } from "../api/fileshare/actions";

const Signup = async () => {
  return (
    <Suspense fallback={"...Loading"}>
      <FileManager currentFile={getCurrentFileName()} />
    </Suspense>
  );
};

export default Signup;
