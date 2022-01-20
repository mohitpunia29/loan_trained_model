{
  "targets": [
    {
      "target_name": "sortCsvOnColumn",
      "sources": ["./libraries/sortCsvOnColumn/nodeWrapper.cpp"],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
