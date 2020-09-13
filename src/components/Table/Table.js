import React, { useState, Fragment, useEffect } from "react";
import Loader from "react-loader-spinner";

const process = (arrData) => {
  //Leave unique country names

  const countries = [
    ...new Set(arrData.map((item) => item.countriesAndTerritories)),
  ];

  const table = countries.map((country) => {
    return {
      country: country.replace(/_/g, " "),
      cases: arrData
        .filter((item) => item.countriesAndTerritories === country)
        .reduce((sum, { cases }) => sum + cases, 0),
      deaths: arrData
        .filter((item) => item.countriesAndTerritories === country)
        .reduce((sum, { deaths }) => sum + deaths, 0),
      population: arrData
        .filter((item) => item.countriesAndTerritories === country)
        .reduce((sum, { popData2019 }) => popData2019, 0),
    };
  });
  //add casesPerThousand and deathsPerThousand
  table.forEach((item) => {
    //Cases on an international conveyance Japan doesn't have population
    if (typeof item.population === "number") {
      Object.assign(item, {
        casesPerThousand: (item.cases / item.population) * 1000,
        deathsPerThousand: (item.deaths / item.population) * 1000,
      });
    } else {
      Object.assign(item, {
        casesPerThousand: 0,
        deathsPerThousand: 0,
      });
    }
  });

  return table;
};

const Table = () => {
  const [response, setResponse] = useState([]);
  const [sort, setSort] = useState(true);
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

  //Sort
  const sortDescending = (type) => {
    response.sort((a, b) => {
      return Number(a[type]) - Number(b[type]);
    });
    setSort(false);
  };

  const casesAscending = (type) => {
    response.sort((a, b) => {
      return Number(b[type]) - Number(a[type]);
    });
    setSort(true);
  };

  return (
    <Fragment>
      {response && response.length === 0 ? (
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
        <table className="table">
          <thead>
            <tr>
              <th>Страна</th>
              <th
                onClick={() => {
                  sort ? sortDescending("cases") : casesAscending("cases");
                }}
              >
                Количество случаев
                <br />
                <i className="fas fa-arrows-alt-v"></i>
              </th>
              <th
                onClick={() => {
                  sort ? sortDescending("deaths") : casesAscending("deaths");
                }}
              >
                Количество смертей
                <br />
                <i className="fas fa-arrows-alt-v"></i>
              </th>
              <th
                onClick={() => {
                  sort
                    ? sortDescending("casesPerThousand")
                    : casesAscending("casesPerThousand");
                }}
              >
                Количество случаев на 1000 жителей
                <br />
                <i className="fas fa-arrows-alt-v"></i>
              </th>
              <th
                onClick={() => {
                  sort
                    ? sortDescending("deathsPerThousand")
                    : casesAscending("deathsPerThousand");
                }}
              >
                Количество смертей на 1000 жителей
                <br />
                <i className="fas fa-arrows-alt-v"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {response &&
              response.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.country}</td>
                    <td>{item.cases}</td>
                    <td>{item.deaths}</td>
                    <td>
                      {item.casesPerThousand &&
                        item.casesPerThousand.toFixed(6)}
                    </td>
                    <td>
                      {item.deathsPerThousand &&
                        item.deathsPerThousand.toFixed(6)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </Fragment>
  );
};

export default Table;
