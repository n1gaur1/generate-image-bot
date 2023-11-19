import fs from 'fs';

export const deleteLocalImage = (fileName: string) => {
  if (fs.existsSync(`./out/${fileName}`)) {
    fs.unlinkSync(`./out/${fileName}`);
    console.log(`${fileName} deleted successfully.`);
  } else {
    console.log(`${fileName} not found.`);
  }
};
