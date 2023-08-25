import { NextApiRequest, NextApiResponse } from "next";

import EventEmitter from "stream";

export const eventEmitter = new EventEmitter();

export const streamApi = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Connected to stream api");
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });

  res.write("data: CONNECTION ESTABLISHED\n");

  eventEmitter.on("progress", (data: number) => {
    res.write(`data: ${data || 0} \n\n`);
  });

  const end = () => {
    console.log("Ending");
  };

  req.on("aborted", () => {
    console.log("aborted ...");
    end();
  });
  req.on("close", () => {
    console.log("Closed ...");
    end();
  });
};

export default streamApi;
