#include <iostream>
#include <regex>

#include "parser.hpp"

using aria::csv::CsvParser;

class DataRow {
  public:
    std::string type;
    std::string value = "";
    std::string stringSortValue;
    float numericSortValue;
    int dateSortValue;

    std::regex DATE_REG = std::regex("([0-9]{1,2})/([0-9]{1,2})/([0-9]{2,4})");

    DataRow(std::string t) {
      type = t;
    }

    void appendToValue(std::string v) {
      value += v;
    }
    void removeTrailingSeparator() {
      value.pop_back();
    }
    void setSortValue(std::string s) {
      if (type == "alphanumeric") {
        stringSortValue = s;
      } else if (type == "numeric") {
        // safeguard against empty values
        if (s == "") {
          s = "0";
        }

        numericSortValue = std::stof(s);
      } else if (type == "date") {
        // safeguard against empty values
        if (s == "") {
          s = "1/1/00";
        }

        // converts std::string to char[]
        char cstr[s.size() + 1];
        s.copy(cstr, s.size() + 1);
        cstr[s.size()] = '\0';

        std::cmatch cm;
        // execute regex
        std::regex_match(cstr, cm, DATE_REG);

        // convert the date value to a number, the date format is m/d/yy
        // so we conditionally add a leading 0 and change it to yymmdd so we can sort it a number
        // Examples:
        // 2/8/19 -> 190208 / 10/1/19 -> 191001 / 8/22/19 -> 190822
        const std::string dateAsString = cm[3].str() + // year
          (cm[1].length() == 1 ? ("0" + cm[1].str()) : cm[1].str()) + // month
          (cm[2].length() == 1 ? ("0" + cm[2].str()) : cm[2].str()); // day
        dateSortValue = std::stoi(dateAsString);
      }
    }

    std::string getValue();
    std::string getSortValue();

    bool operator < (const DataRow& dataRow) const {
      if (type == "alphanumeric") {
        return (stringSortValue < dataRow.stringSortValue);
      }
      if (type == "numeric") {
        return (numericSortValue < dataRow.numericSortValue);
      }
      if (type == "date") {
        return (dateSortValue < dataRow.dateSortValue);
      }
    }
    bool operator > (const DataRow& dataRow) const {
      if (type == "alphanumeric") {
        return (stringSortValue > dataRow.stringSortValue);
      }
      if (type == "numeric") {
        return (numericSortValue > dataRow.numericSortValue);
      }
      if (type == "date") {
        return (dateSortValue > dataRow.dateSortValue);
      }
    }
};

namespace sortCsv {
  int sort(
    std::string inputFilePath, std::string outputFilePath,
    std::string column, std::string direction, std::string type,
    std::string separator
  ) {
    std::ifstream inputFile(inputFilePath);

    CsvParser parser(inputFile);
    parser
      .delimiter(',');

    int lineCount = 0;
    int columnIndex = -1;

    std::string headerRow = "";
    std::vector<DataRow> dataRows;

    for (auto& row : parser) {
      // Parse the header row first
      if (lineCount == 0) {
        int tempColumnIndex = 0;
        for (auto& field : row) {
          if (field == column) {
            columnIndex = tempColumnIndex;
          }
          headerRow += field + separator;
          tempColumnIndex++;
        }
        headerRow.pop_back(); // remove trailing separator

        if (columnIndex == -1) {
          std::cout << "Column " << column << " not found in file" << std::endl;
          return 1;
        }
      } else { // parse the data rows
        int tempColumnIndex = 0;
        DataRow * dataRow = new DataRow(type);
        for (auto& field : row) {
          dataRow->appendToValue(field + separator);
          if (tempColumnIndex == columnIndex) {
            dataRow->setSortValue(field);
          }
          tempColumnIndex++;
        }
        dataRow->removeTrailingSeparator();
        dataRows.push_back(*dataRow);
      }

      lineCount++;
    }

    if (direction.compare("asc") == 0) {
      std::sort(dataRows.begin(), dataRows.end());
    } else {
      std::sort(dataRows.begin(), dataRows.end(), std::greater<DataRow>());
    }

    std::ofstream myfile;
    myfile.open(outputFilePath);
    myfile << headerRow << std::endl;
    for (DataRow& row : dataRows) {
      myfile << row.value << std::endl;
    }
    myfile.close();

    return 0;
  }
}
