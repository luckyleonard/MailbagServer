import path from 'path';
import express, { Express, NextFunction, Request, Response } from 'express';
import { serverInfo } from './server/ServerInfo';
import * as IMAP from './imap';
import * as SMTP from './smtp';
import * as Contacts from './contact';
import { IContact } from './contact';

const app: Express = express();
app.use(express.json());
app.use((inRequest: Request, inResponse: Response, inNext: NextFunction) => {
  inResponse.header('Access-Control-Allow-Origin', '*');
  inResponse.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  inResponse.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  inNext();
});

app.get('/mailboxes', async (req: Request, res: Response) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
    res.json(mailboxes);
  } catch (error) {
    res.send(`error: ${error}`);
  }
});

app.get('/mailboxes/:mailbox', async (req: Request, res: Response) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
    const messages: IMAP.IMessage[] = await imapWorker.listMessages({
      mailbox: req.params.mailbox,
    });
    res.json(messages);
  } catch (error) {
    res.send(`error: ${error}`);
  }
});

app.get('/messages/:mailbox/:id', async (req: Request, res: Response) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
    const messageBody: string | undefined = await imapWorker.getMessageBody({
      mailbox: req.params.mailbox,
      id: parseInt(req.params.id, 10),
    });
    res.send(messageBody); //a plain text,maybe a HTML message
  } catch (error) {
    res.send(`error: ${error}`);
  }
});

app.delete('/messages/:mailbox/:id', async (req: Request, res: Response) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
    await imapWorker.deleteMessage({
      mailbox: req.params.mailbox,
      id: parseInt(req.params.id, 10),
    });
    res.send('ok');
  } catch (error) {
    res.send(`error: ${error}`);
  }
});
app.post('/messages', async (req: Request, res: Response) => {
  try {
    const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
    await smtpWorker.sendMessage(req.body);
    res.send('OK');
  } catch (error) {
    res.send(`error: ${error}`);
  }
});

app.get('/contacts', async (req: Request, res: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: IContact[] = await contactsWorker.listContacts();
    res.json(contacts);
  } catch (error) {
    res.send(`error:${error}`);
  }
});

app.post('/contacts', async (req: Request, res: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contact: IContact = await contactsWorker.addContact(req.body);
    res.json(contact);
  } catch (error) {
    res.send(`error:${error}`);
  }
});

app.delete('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    await contactsWorker.deleteContact(req.params.id);
    res.send('OK');
  } catch (error) {
    res.send(`error:${error}`);
  }
});
app.listen(5000, () => {
  console.log(`Server running at http://localhost:5000`);
});
