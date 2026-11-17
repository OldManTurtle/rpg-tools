"use client";
import React, { use, useState } from "react";
import { ReactQRCode } from "@lglab/react-qr-code";
import {
  downloadFileAction,
  getCurrentFileName,
  uploadFile,
} from "../api/fileshare/actions";
import { Paper, TextField } from "@mui/material";

const handleFileDownload = async () => {
  try {
    alert("Downloading!");
    const fileUrl = await downloadFileAction();
    console.log(fileUrl);
    alert(fileUrl?.name);
    if (!fileUrl) return;
    const link = document.createElement("a");
    // eslint-disable-next-line unicorn/prefer-global-this
    link.href = window.URL.createObjectURL(fileUrl);
    link.download = (await getCurrentFileName()) || "file.txt";
    link.click();
    // eslint-disable-next-line unicorn/prefer-global-this
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.log("Error", error);
  }
};
const staticName = "TheWildsea.zip";
export const FileManager = ({
  currentFile,
}: {
  currentFile: Promise<string | undefined>;
}) => {
  const filename = use(currentFile);

  const [ipAddress, setIpAddress] = useState("localhost");
  return (
    <div>
      {filename}
      <form action={uploadFile}>
        <input type="file" name="file" multiple={false} />
        <button type="submit">Submit</button>
      </form>
      <a href={"./" + staticName}>Download Static</a>
      <form action={handleFileDownload}>
        <button type="submit">Download</button>
      </form>
      <Paper sx={{ padding: 5 }}>
        <TextField
          color={"primary"}
          label={"IP"}
          onChange={(v) => setIpAddress(v.target.value)}
          value={ipAddress}
        />
        <ReactQRCode
          marginSize={2}
          size={256}
          value={"http://" + ipAddress + ":3000/" + staticName}
        />
      </Paper>
    </div>
  );
};
