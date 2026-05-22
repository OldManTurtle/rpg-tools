"use client";
import React, { use } from "react";

import {
  downloadFileAction,
  getCurrentFileName,
  uploadFile,
} from "../api/fileshare/actions";

const handleFileDownload = async () => {
  try {
    const fileUrl = await downloadFileAction();
    console.log(fileUrl);
    if (!fileUrl) return;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = (await getCurrentFileName()) || "file.txt";
    link.click();
  } catch (error) {
    console.log("Error", error);
  }
};

export const FileManager = ({
  currentFile,
}: {
  currentFile: Promise<string | undefined>;
}) => {
  const filename = use(currentFile);

  return (
    <div>
      {filename}
      <form action={uploadFile}>
        <input type="file" name="file" multiple={false} />
        <button type="submit">Submit</button>
      </form>
      <form action={handleFileDownload}>
        <button type="submit">Download</button>
      </form>
    </div>
  );
};
