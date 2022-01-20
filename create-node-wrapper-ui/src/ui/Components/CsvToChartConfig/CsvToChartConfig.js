import React, { useState, useEffect } from 'react';
import {
  cloneDeep as _cloneDeep,
  forEach as _forEach,
  get as _get,
  times as _times
} from 'lodash';
import papaparse from 'papaparse';

import { Typography } from '@material-ui/core';
import { DndProvider } from 'react-dnd';
import html5Backend from 'react-dnd-html5-backend';

import parsePropTypesSchema from '../Graphs/utils/parsePropTypesSchema';

import Section from './Components/Section/Section';
import CsvInput from './Components/CsvInput/CsvInput';
import ChartsList from './Components/ChartsList/ChartsList';
import ConfigCreator from './Components/ConfigCreator/ConfigCreator';
import Visualization from './Components/Visualization/Visualization';

function CsvToChartConfig() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState({});
  const [chart, setChart] = useState();
  const [config, setConfig] = useState({
    fields  : [],
    required: []
  });
  const [data, setData] = useState({});

  useEffect(() => {
    if (csv) {
      convertCsvToJson();
    } else {
      setJson({});
      setChart();
      setConfig({
        fields  : [],
        required: []
      });
      setData({});
    }
  }, [csv]);

  // reset the config when the chart changes
  useEffect(() => {
    if (chart) {
      setConfig(parsePropTypesSchema(chart.propTypesSchema));
      setData({
        chartData: {
          data: json
        },
        ..._cloneDeep(chart.defaultProps)
      });
    } else {
      setData({
        chartData: {
          data: json
        }
      });
    }
  }, [chart]);

  useEffect(() => {
    _forEach(config.fields, (conf) => {
      if (conf.exactItemsRef || conf.minItems || conf.maxItems) {
        setData((prevState) => {
          let minItems = conf.minItems || 0;
          let maxItems = conf.maxItems || Number.POSITIVE_INFINITY;

          if (conf.exactItemsRef) {
            const exactItems = _get(prevState, conf.exactItemsRef.slice(1), 0);
            minItems = Math.max(minItems, exactItems); // we ensure that if min is set, it's used over exactItems
            maxItems = minItems;
          }

          const array = _get(prevState, conf.path);

          // no change
          if (!array || (array.length >= minItems && array.length <= maxItems)) return prevState;

          if (array.length > maxItems) {
            array.splice(maxItems);
          } else if (array.length < minItems) {
            array.push(..._times(minItems - array.length, () => undefined));
          }

          return { ...prevState };
        });
      }
    });
  }, [data, config]);

  async function convertCsvToJson() {
    const asJson = papaparse.parse(csv, { header: true });

    setJson(asJson.data);
    setData({
      chartData: {
        data: asJson.data
      }
    });
  }

  console.log(data, json, config);

  return (
    <div>
      <Typography
        variant='h1'
      >
        Csv to Graph
      </Typography>
      <Section
        title='1. Paste your CSV file content'
      >
        <CsvInput
          csv={csv}
          setCsv={setCsv}
        />
      </Section>
      {csv && (
        <Section
          title='2. Choose the chart'
        >
          <ChartsList
            selectedChart={chart}
            selectChart={setChart}
          />
        </Section>
      )}
      {json && chart && (
        <Section
          title='3. Configure the chart'
        >
          <ConfigCreator
            csvColumns={Object.keys(json[0])}
            config={{
              fields  : config.fields.filter(({ type }) => type !== 'data'),
              required: config.required
            }}
            data={data}
            setData={setData}
          />
        </Section>
      )}
      {chart && data && (
        <Section
          title='4. Visualize'
        >
          <Visualization
            chart={chart}
            json={json}
            config={config}
            data={data}
          />
        </Section>
      )}
    </div>
  );
}

export default function CsvToChartConfigWithDragAndDropContext() {
  return (
    <DndProvider backend={html5Backend}>
      <CsvToChartConfig />
    </DndProvider>
  );
}
