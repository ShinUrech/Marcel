/* eslint-disable prettier/prettier */
import * as pc from 'picocolors';
import * as fs from 'fs';
import * as path from 'path';

export const downloadImage = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image, status: ${response.status}`);
    }
    console.log(pc.blueBright(`----->>> Processing Download Image`));
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine the file extension from the URL
    const cleanUrl = imageUrl.split('?')[0];
    const fileExtension = path.extname(cleanUrl);

    const filename = `image-${Date.now()}${fileExtension || '.jpg'}`;
    // Create the local file path with the appropriate extension
    const localPath = path.resolve(path.join(process.cwd(), 'public', filename));

    // Write the image buffer to a file on the disk
    fs.writeFileSync(localPath, buffer);

    console.log(`--->> Image downloaded successfully to ${localPath}`);

    return filename;
  } catch (error) {
    console.log(`Error downloading Image`);
    console.log(`Error ${error}`);
  }
};
