import fs from 'fs';
import { Dropbox } from 'dropbox';
import { getEnv } from '../lib/env';

const {
  dropboxAccessToken,
  dropboxRefreshToken,
  dropboxAppKey,
  dropboxAppSecret,
} = getEnv();

export const deleteDropboxImage = async (fileName: string) => {
  
  try {
    const dropboxClient = new Dropbox({
      accessToken: dropboxAccessToken,
      refreshToken: dropboxRefreshToken,
      clientId: dropboxAppKey,
      clientSecret: dropboxAppSecret,
    });

    await dropboxClient.filesDeleteV2({
      path: `/${fileName}`,
    });

    console.log(`${fileName} deleted successfully from Dropbox.`);
  } catch (error) {
    console.log(`Dropboxの${fileName}の削除に失敗しました。`);
  }
};

export const uploadImageToDropbox = async (fileName: string) => {

  try {
    const dropboxClient = new Dropbox({
      accessToken: dropboxAccessToken,
      refreshToken: dropboxRefreshToken,
      clientId: dropboxAppKey,
      clientSecret: dropboxAppSecret,
    });

    const buffer = fs.readFileSync(`./out/${fileName}`);
    await dropboxClient.filesUpload({
      path: `/${fileName}`,
      contents: buffer,
    });
    await dropboxClient.sharingCreateSharedLinkWithSettings({
      path: `/${fileName}`,
    });
    const sharingLinks = await dropboxClient.sharingListSharedLinks({
      path: `/${fileName}`,
      direct_only: true,
    });

    return sharingLinks.result.links.map((link) =>
      link.url.replace('www.dropbox', 'dl.dropboxusercontent')
    );
  } catch (error) {
    console.log(error);
    throw new Error(`Dropboxへのアップロードに失敗しました。`);
  }
};
