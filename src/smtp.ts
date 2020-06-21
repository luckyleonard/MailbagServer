import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { IServerInfo } from './server/ServerInfo';

export class Worker {
  private static serverInfo: IServerInfo; //not been use just a example for static variable
  constructor(inServerInfo: IServerInfo) {
    Worker.serverInfo = inServerInfo;
  }
  public sendMessage(inOption: SendMailOptions): Promise<string> {
    return new Promise((inResolve, inReject) => {
      const transport: Mail = nodemailer.createTransport(
        Worker.serverInfo.smtp
      );
      transport.sendMail(
        inOption,
        (inError: Error | null, inInfo: SentMessageInfo) => {
          if (inError) {
            inReject(inError);
          } else {
            inResolve();
          }
        }
      );
    });
  }
}
