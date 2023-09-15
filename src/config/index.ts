import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST} = process.env
export const db = new Sequelize(
    DB_NAME!,
    DB_USERNAME!,
    DB_PASSWORD as string,
    {​​​​​​​
      host: DB_HOST,
      port: DB_PORT as unknown as number,
      dialect: "postgres",
      logging: false,
      dialectOptions: {​​​​​​​
        encrypt: true,
      //  ssl: {​​​​​​​
      //    rejectUnauthorized: false,
      //  }​​​​​​​,
      }​​​​​​​,
    }​​​​​​​
  );


//SENDING OTP TO PHONE
export const accountSid = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN
export const fromAdminPhone = process.env.FROMADMINPHONE

//SENDING OTP TO EMAIL
export const GMAIL_USER = process.env.Gmail
export const GMAIL_PASS = process.env.GmailPass
export const FromAdminMail = process.env.FromAdminMail as string
export const userSubject = process.env.userSubject as string
export const APP_SECRET = process.env.APP_SECRET as string;
export const Base_Url = process.env.BASE_URL as string;
export const URL = process.env.URL as string;
export const port = process.env.PORT || 4000;
