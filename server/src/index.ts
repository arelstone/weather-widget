import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { compass } from './utils/compass';
import { WeatherResponse, QueryParams,Units } from './types';
import axios from 'axios';
import cors from 'cors'
import { exit } from 'process';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())


if (process.env.OPEN_WEATHER_APP_ID) {
  console.error('Missing `process.env.OPEN_WEATHER_APP_ID`')
  exit(1)
}


app.get('/', async (req: Request, res: Response) => {
  const {
    city = 'København', 
    lang = 'da', 
    units = 'metric'
  }: QueryParams = req.query ?? {}

  const url = new URL('http://api.openweathermap.org/data/2.5/weather')
  url.searchParams.append('q', `${city}`)
  url.searchParams.append('appid', process.env.OPEN_WEATHER_APP_ID)
  url.searchParams.append('lang', `${lang}`)
  url.searchParams.append('units', `${units}`)

  const {data} = await axios<WeatherResponse>(`${url}`)

  if (Number(data.cod) !== 200) {
    res.status(Number(data.cod)).json({message: data.message})
    return
  }

  const unit = (units: Units) => {
    if (units === 'metric') { return 'C'}
    if (units === 'imperial') { return 'F'}

    return 'K'
  }

  res.json({
    cod: 200,
    city: data.name,
    humidity: data.main.humidity,
    temperature: { 
      unit: unit(units), 
      value: Math.round(Math.ceil(data.main.temp))
    },
    wind: { 
      direction: compass(data.wind), 
      value: Math.round(Math.ceil(data.wind.speed))
    }
  })

  return
});

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running on port ${port}`);
});