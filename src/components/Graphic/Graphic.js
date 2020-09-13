import React, { Fragment, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "react-loader-spinner";
import moment from "moment";

const process = (arrData) => {
  //Get uniq dates

  const dates = [...new Set(arrData.map((item) => item.dateRep))];

  //First iteration, get sum of cases and deaths for every date
  const resultDate = dates.map((date) => {
    return {
      date: moment(date, "DD,MM,YYYY").format("MMMM YYYY"),
      casesPeriod: arrData
        .filter((item) => item.dateRep === date)
        .reduce((sum, { cases }) => sum + cases, 0),
      deaths: arrData
        .filter((item) => item.dateRep === date)
        .reduce((sum, { deaths }) => sum + deaths, 0),
    };
  });

  const month = [...new Set(resultDate.map((item) => item.date))];

  //   //Second iteration, get sum of cases and deaths for every month
  const resultMonth = month.map((date) => {
    return {
      date,
      casesPeriod: resultDate
        .filter((item) => item.date === date)
        .reduce((sum, { casesPeriod }) => sum + casesPeriod, 0),
      deaths: resultDate
        .filter((item) => item.date === date)
        .reduce((sum, { deaths }) => sum + deaths, 0),
    };
  });

  //Sort array
  const arraySorted = resultMonth.sort((a, b) => {
    return moment(a.date).diff(b.date);
  });
  return arraySorted;
};

function Graphic() {
  const [response, setResponse] = useState([]);
  useEffect(() => {
    //fetch using proxy, fixing Access-Control-Allow-Origin issue
    fetch(
      "https://cors-anywhere.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/casedistribution/json/"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(process(data.records));
      });
  }, []);

  return (
    <Fragment>
      {response.length === 0 ? (
        <div className="loader">
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={150}
            width={150}
            timeout={1000}
          />
        </div>
      ) : (
        <ResponsiveContainer>
          <LineChart
            data={response}
            margin={{
              top: 5,
              right: 30,
              left: 40,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="date"
              interval={0}
              tick={{ fontSize: 13, width: 100, fill: "black" }}
              minTickGap={2}
              tickSize={4}
              label={{
                value: "Период",
                position: "bottom",
                dy: 10,
                offset: -10,
                fontSize: 18,
                fill: "#54424B",
              }}
            />
            <YAxis
              type="number"
              tick={{ fontSize: 14, width: 250, fill: "black" }}
              label={{
                value: "Cлучаи",
                position: "insideLeft",
                dy: -50,
                offset: -35,
                fontSize: 18,
                fill: "#54424B",
              }}
            />

            <Tooltip />
            <Legend
              verticalAlign="top"
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Line
              name="Cлучаи"
              type="monotone"
              dataKey="casesPeriod"
              stroke="#FFCF50"
              activeDot={{ r: 8 }}
            />
            <Line
              name="Cмерти"
              type="monotone"
              dataKey="deaths"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Fragment>
  );
}

export default Graphic;
