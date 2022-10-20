export const generateRandomString = (length: number) => {
  const chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
  const randomArray = Array.from(
    { length: length },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  return randomArray.join("");
};
