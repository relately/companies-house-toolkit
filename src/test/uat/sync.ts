import { mkdirp } from 'mkdirp';
import fs from 'node:fs';
import path from 'node:path';
import { Client, ConnectConfig, FileEntry, SFTPWrapper } from 'ssh2';

export const syncProducts = async (directories: string[]) => {
  for (const directory of directories) {
    const targetDir = `${process.cwd()}/src/test/uat/data/${directory}`;

    await mkdirp(targetDir);

    // Get latest files from Companies House via FTP
    await syncDirectories(`free/${directory}`, targetDir, {
      host: process.env.SFTP_HOST || '',
      username: process.env.SFTP_USERNAME || '',
      privateKey: process.env.SFTP_PRIVATE_KEY || '',
      passphrase: process.env.SFTP_PASSPHRASE || '',
    });
  }
};

const syncDirectories = (
  remoteDir: string,
  localDir: string,
  sshConfig: ConnectConfig
) => {
  return new Promise((resolve, reject) => {
    const connection = new Client();

    connection
      .on('ready', () => {
        connection.sftp((err, sftp) => {
          if (err) throw err;

          // Call the async function outside of the sftp callback
          syncSftp(sftp, remoteDir, localDir)
            .then(resolve)
            .catch(console.error)
            .finally(() => connection.end());
        });
      })
      .on('error', reject)
      .connect(sshConfig);
  });
};

const syncSftp = async (
  sftp: SFTPWrapper,
  remoteDir: string,
  localDir: string
) => {
  const files = await listDirectory(sftp, remoteDir);

  for (const file of files) {
    const remotePath = path.join(remoteDir, file.filename);
    const localPath = path.join(localDir, file.filename);

    if (file.longname.startsWith('d')) {
      // Skip day directories that already exist locally
      if (
        remotePath.match(/\d{4}\/\d{2}\/\d{2}$/) &&
        fs.existsSync(localPath)
      ) {
        console.log('skipping', remotePath);
        continue;
      }

      console.log('syncing', remotePath);

      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }

      await syncSftp(sftp, remotePath, localPath);
    } else {
      const localFileExists = fs.existsSync(localPath);
      const localFileIsNewer =
        localFileExists &&
        fs.statSync(localPath).mtime > new Date(file.attrs.mtime * 1000);

      if (!localFileExists || !localFileIsNewer) {
        await new Promise((resolve, reject) => {
          sftp.fastGet(remotePath, localPath, (err) => {
            if (err) reject(err);
            else resolve(null);
          });
        });
      }
    }
  }
};

const listDirectory = (sftp: SFTPWrapper, path: string) => {
  return new Promise<FileEntry[]>((resolve, reject) => {
    sftp.readdir(path, (err, list) => {
      if (err) reject(err);
      else resolve(list);
    });
  });
};
