import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import twilio from 'twilio';

export function shouldRevalidate() {
  return false;
}

export async function action({ request }: ActionFunctionArgs) {
  return json({ success: true });
}

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = twilio(accountSid, authToken);

// const { phoneNumber, message } = await request.json();

// console.log('phoneNumber:', phoneNumber);
// console.log('message:', message);

// try {
//   await client.messages.create({
//     body: message,
//     from: '+12568277567',
//     to: phoneNumber,
//   });

//   return { success: true };
// } catch (error) {
//   return json(error);
// }

export default function SendMessage() {
  return <div>dupa</div>;
}
