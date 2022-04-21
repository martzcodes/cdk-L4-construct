import { EventBridge } from "aws-sdk";

export const handler = async () => {
  const eventBridge = new EventBridge({ region: "us-east-1" });
  try {
    const res = await eventBridge
      .putEvents({
        Entries: [
          {
            EventBusName: process.env.EVENT_BUS,
            Source: process.env.EVENT_SOURCE,
            DetailType: "SomeDetail",
            Detail: JSON.stringify({
              someDetail: new Date().getTime(),
            }),
          },
        ],
      })
      .promise();
    console.log(JSON.stringify(res));
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(res, null, 2),
    };
  } catch (e) {
    console.log(e);
  }
  return {
    statusCode: 500,
    headers: {
      "Content-Type": "application/json",
    },
    body: "error",
  };
};
