"use client";
import React, { use } from "react";

import { uploadFile } from "../api/fileshare/route";
import { downloadFileAction } from "../api/fileshare/actions";

const handleFileDownload = async () => {
  try {
    const fileUrl = await downloadFileAction();
    const link = document.createElement("a");
    link.href = fileUrl;
    link.name = "test.txt";
    link.download = "test.txt";
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
      <button formAction={handleFileDownload}>Download</button>
    </div>
  );
};
