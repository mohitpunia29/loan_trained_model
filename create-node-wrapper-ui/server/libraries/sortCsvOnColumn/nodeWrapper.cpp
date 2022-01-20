#include <nan.h>
#include "sortCsv.cpp"

NAN_METHOD(SortCsvOnColumn) {
  for (int i = 0; i < 5; i++) {
    if (!info[i]->IsString()) {
      Nan::ThrowTypeError("argument must be a string!");
      return;
    }
  }

  std::string inputFilePath = *Nan::Utf8String(info[0]);
  std::string outputFilePath = *Nan::Utf8String(info[1]);
  std::string column = *Nan::Utf8String(info[2]);
  std::string direction = *Nan::Utf8String(info[3]);
  std::string type = *Nan::Utf8String(info[4]);
  std::string separator = *Nan::Utf8String(info[5]);

  int result = sortCsv::sort(inputFilePath, outputFilePath, column, direction, type, separator);

  if (result != 0) {
    Nan::ThrowError("An error occured while sorting the CSV");
  }
}

NAN_MODULE_INIT(Initialize) {
    NAN_EXPORT(target, SortCsvOnColumn);
}

NODE_MODULE(addon, Initialize);
