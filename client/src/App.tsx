import { SyntheticEvent, useEffect, useState } from 'react';

type ApiResponse = {
  cod: number
  message?: string
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
  const [data, setData] = useState<ApiResponse>()
  const [query, setQuery] = useState<string>(new URL(globalThis?.location?.href).searchParams.get('city') ?? '')
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setErrorMessage(undefined)

    const url = new URL(process.env.REACT_APP_API_URL!)
    url.searchParams.append('city', query)
    url.searchParams.append('lang', 'da')
    url.searchParams.append('units', 'metric')

    const res = await fetch(`${url}`)
    const json: ApiResponse = await res.json()

    if (Number(json.cod) !== 200) {
      setErrorMessage(json.message)
      return
    }

    setData(json)
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
