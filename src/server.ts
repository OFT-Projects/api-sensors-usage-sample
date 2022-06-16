import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

interface IReqLightSensor {
  ldr_value: number;
}

interface IResLightSensor {
  led_state: number;
}

interface IReqReceivedLog {
  host?: string;
  value: string;
}

const generateReqReceivedLog = (data: IReqReceivedLog) => {
  return `Request received from ${data.host} at ${new Date().toUTCString()} `
  + `with the following value: ${JSON.stringify(data.value)}`;
}

const LDR_SENSIBILITY = 650;

app.post('/light-sensor', (req: Request, res: Response) => {
  const dataLog: IReqReceivedLog = {
    host: req.headers.host,
    value: req.body,
  }

  console.log(generateReqReceivedLog(dataLog));

  const req_data: IReqLightSensor = req.body;

  const errors = [];

  if (!req_data.ldr_value) errors.push('ldr_value is missing'); 
  
  if (errors.length > 0) {
    res.status(400).send({ errors });
    return;
  }

  let res_data: IResLightSensor = {} as IResLightSensor;

  // 0 to turn of the led or 1 to turn on
  res_data.led_state = req_data.ldr_value > LDR_SENSIBILITY ? 0 : 1;
  
  res.status(200).send(res_data);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});