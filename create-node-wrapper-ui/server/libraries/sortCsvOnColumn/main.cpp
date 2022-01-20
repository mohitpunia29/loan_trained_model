#include <iostream>
#include "cliparser.hpp"
#include "sortCsv.cpp"

void initClArgs(cli::Parser *clArgs) {
  clArgs->set_required("i", "input-file",
    "The path of the CSV input file");
  clArgs->set_required("o", "output-file",
    "The path to the CSV output file");
  clArgs->set_required("c", "column-text",
    "The name of the column we'll use to sort");
  clArgs->set_required("d", "direction",
    "The sorting direction, asc/desc");
  clArgs->set_required("t", "type",
    "The type of the column values, alphanumeric/numeric/date");

  clArgs->set_optional("s", "separator", ",",
    "The CSV column delimiter");
}

int main(int argc, char *argv[]) {
  cli::Parser *clArgs = new cli::Parser();
  initClArgs(clArgs);
  if (!clArgs->parse(argc, argv)) return 1;

  return sortCsv::sort(
    clArgs->get<std::string>("i"),
    clArgs->get<std::string>("o"),
    clArgs->get<std::string>("c"),
    clArgs->get<std::string>("d"),
    clArgs->get<std::string>("t"),
    clArgs->get<std::string>("s")
  );
}
