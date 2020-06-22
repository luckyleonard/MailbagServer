require('dotenv').config();

const path = require('path');
const fs = require('fs');
const {
  SMTP_HOST,
  SMTP_PORT,
  IMAP_HOST,
  IMAP_PORT,
  AUTH_USER,
  AUTH_PSW,
} = process.env;

export interface IServerInfo {
  smtp: {
    host: string | undefined;
    port: string | undefined;
    auth: {
      user: string | undefined;
      pass: string | undefined;
    };
  };
  imap: {
    host: string | undefined;
    port: string | undefined;
    auth: {
      user: string | undefined;
      pass: string | undefined;
    };
  };
}

export let serverInfo: IServerInfo;

// const rawInfo: string = fs.readFileSync(
//   path.join(__dirname, '../serverInfo.json')
// );
// serverInfo = JSON.parse(rawInfo);
serverInfo = {
  smtp: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: { user: AUTH_USER, pass: AUTH_PSW },
  },
  imap: {
    host: IMAP_HOST,
    port: IMAP_PORT,
    auth: { user: AUTH_USER, pass: AUTH_PSW },
  },
};
