export const array_move = <T>(array: T[], old_index: number) => {
  const new_index = old_index - 1;
  const a = [...array];
  a.splice(new_index, 0, a.splice(old_index, 1)[0]);
  return a; // for testing
};

export const makeId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
