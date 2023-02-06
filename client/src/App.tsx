import React, { SyntheticEvent, useEffect, useState } from 'react';
import { compass } from './utils/compass';



type Data = {
  city: string
  temperature: {
    unit: string
    value: number
  }
  humidity: number
  wind: {
    value: number,
    direction: string
  }
}

function App() {

  const getQueryFromUrl = () => {
    const { href } = globalThis.location ?? {}

    if (!href) {
      return null
    }

    return new URL(href).searchParams.get('city')?.toLowerCase()
  }

  const [data, setData] = useState<Data>()
  const [query, setQuery] = useState<string>(getQueryFromUrl() ?? 'København')
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    setErrorMessage(undefined)

    const url = new URL('http://api.openweathermap.org/data/2.5/weather')
    url.searchParams.append('q', query)
    url.searchParams.append('appid', process.env.REACT_APP_OPEN_WEATHER_APP_ID!)
    url.searchParams.append('lang', 'da')
    url.searchParams.append('units', 'metric')

    const res = await fetch(`${url}`)
    const json: WeatherResponse = await res.json()

    if (Number(json.cod) !== 200) {
      setErrorMessage(json.message)
      return
    }

    setData({
      city: json?.name,
      humidity: json.main.humidity,
      temperature: { unit: 'C', value: Math.round(Math.ceil(json.main.temp)) },
      wind: { direction: compass(json.wind), value: Math.round(Math.ceil(json.wind.speed)) },
    })

  }

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
    setData(undefined)
    window.history.pushState(null, '', `?city=${query.toLowerCase()}`)
    return fetchData()
  }

  return (
    <div
      className="widget"
      style={{ margin: '10px', width: '300px' }}
    >
      <div className={["panel", !!errorMessage ? "panel-danger" : "panel-info"].join(' ')}>
        {!!errorMessage
          ? <div className="panel-heading"><b>{errorMessage}</b></div>
          : <div className="panel-heading">Weather in <b>{data?.city}</b></div>
        }
        <ul className="list-group">
          <li className="list-group-item">Temperature: <b>{data?.temperature.value}°{data?.temperature.unit}</b></li>
          <li className="list-group-item">Humidity: <b>{data?.humidity}</b></li>
          <li className="list-group-item">Wind: <b>{data?.wind.value} m/s</b> {data?.wind.direction} </li>
          <li className="list-group-item">
            <form className="form-inline" onSubmit={(e) => onSubmit(e)}>
              <div className="form-group">
                <input type="text" className="form-control" id="city" placeholder="City" onChange={(e) => setQuery(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-default">Search</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;

type WeatherResponse = {
  coord: { lon: number, lat: number },
  weather: [
    {
      id: number
      main: string,
      description: string,
      icon: string
    }
  ],
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  },
  visibility: number,
  wind: { speed: number, deg: number },
  clouds: { all: number },
  dt: number,
  sys: {
    type: number
    id: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: number
  id: number
  name: string
  cod: number | string
  message?: string
}