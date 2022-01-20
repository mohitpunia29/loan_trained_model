# SortCsvOnColumn

This C++ library sorts a CSV file based on the specified column (and a few extra arguments).  
It uses the `parser.hpp` to parse the CSV.  
The library `sortCsv.cpp` is a thin wrapper around it.

## Run manually

To run it manually, you will need `cliparser.hpp`, `main.cpp`.

### Compile

```bash
clang++ -std=c++11 -stdlib=libc++ -o sort_csv_on_column main.cpp
```

### Run

```bash
./sort_csv_on_column \
  -i "AI-model-evaluator/sample.csv" \
  -o "AI-model-evaluator/sample-sort.csv" \
  -c "CREATED DATE" \
  -d "asc" \
  -t "date" \
  -s ","
```

## Compile for node

In order to use the code in node, you will need to create a `binding.gyp` file (see `server/binding.gyp`).

### Compile

```bash
node-gyp rebuild
```

### Run

```bash
node

> const { SortCsvOnColumn } = require('./build/Release/sortCsvOnColumn');
> SortCsvOnColumn("AI-model-evaluator/sample.csv", "AI-model-evaluator/sample-sort.csv", "CREATED DATE", "asc", "date", ",");
```
