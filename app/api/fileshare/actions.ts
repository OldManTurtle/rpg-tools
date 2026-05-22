"use server";

import { revalidatePath } from "next/cache";

/* eslint-disable func-style */
// export async function POST(...arguments_) {
//   console.log("POSTED", arguments_);
// }

let thefile: File | undefined = undefined;
let buff: ArrayBuffer | undefined;
export const uploadFile = async (formData: FormData) => {
  thefile = formData.get("file") as File;
  buff = await thefile.arrayBuffer();
  revalidatePath("/");
  console.log("SETBUFF", buff);
};

export const getCurrentFile = async () => {
  return thefile?.name;
};

export const getAction = async () => {
  console.log("REQ", buff?.byteLength, thefile?.name);
  const response = new Response(buff);
  return response;
};

export async function downloadFileAction() {
  const buffer = thefile?.arrayBuffer();

  // Convert to base64 to be serializable
  const base64Data = buffer?.toString();
  console.log("DATA", base64Data);
  // Return base64 to client
  return `data:application/octet-stream;base64,${base64Data}`;
}
