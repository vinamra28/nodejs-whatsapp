import axios from "axios";
import { API_URL, TOKEN } from "./constants";
require("dotenv").config();

async function checkContact(mobileNumber: string) {
  let obj = {
    blocking: "wait",
    contacts: [mobileNumber],
    force_check: true,
  };
  let x: any = await axios.post(`${API_URL}/v1/contacts`, obj, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return x.data;
}

async function sendMessage(mobileNumber: string, name: string, id: string) {
  let obj = {
    to: mobileNumber,
    type: "text",
    recipient_type: "individual",
    text: {
      body: `Welcome ${name}. Your ID is ${id}`,
    },
  };

  let resp: any = await axios.post(`${API_URL}/v1/messages/`, obj, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return resp.data;
}

async function main() {
  let mobileNumber: string = "+91 9999999999";
  let mobileStatus = await checkContact(mobileNumber);
  if (mobileStatus.contacts[0].status === "valid") {
    let whatsAppID = mobileStatus.contacts[0].wa_id;
    let msgSentStatus = await sendMessage(whatsAppID, "name", "123");
    console.log(msgSentStatus);
    if (msgSentStatus.errors !== undefined) {
      console.log("----------------------");
      console.log(`Error for ${whatsAppID}`);
      console.log(`${msgSentStatus.errors[0].title}`);
      console.log(`${msgSentStatus.errors[0].details}`);
      console.log("----------------------");
    }
    let messageId: string = msgSentStatus.messages[0].id;
    console.log(`message sent with message id ${messageId} `);
  } else {
    console.log(`can't verify the ${mobileNumber}`);
  }
}

main();
