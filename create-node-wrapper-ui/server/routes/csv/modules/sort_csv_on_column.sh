#!/bin/bash

usage(){
	echo "Usage: $0 -i [input-file] -o [output-file] -c [column-text] -d [direction] -t [type] [-s [separator=',']]"
	exit 1
}

while [ $# -gt 1 ]
do
key="$1"

case $key in
    -i|--input)
    INPUT="$2"
    shift # past argument
    ;;
    -o|--output)
    OUTPUT="$2"
    shift # past argument
    ;;
    -c|--column)
    COLUMN="$2"
    shift # past argument
    ;;
    -d|--direction)
    DIRECTION="$2"
    shift # past argument
    ;;
    -t|--type)
    TYPE="$2"
    shift # past argument
    ;;
    -s|--separator)
    SEPARATOR="$2"
    shift # past argument
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

if [ -z "$INPUT" ]
  then
    echo "Input file should be provided"
    usage
fi
if [ -z "$OUTPUT" ]
  then
    echo "Output file should be provided"
    usage
fi
if [ -z "$COLUMN" ]
  then
    echo "Column should be provided"
    usage
fi
if [ -z "$DIRECTION" ]
  then
    echo "Direction should be provided"
    usage
fi
if [ -z "$TYPE" ]
  then
    echo "Type should be provided"
    usage
fi
if [ -z "$SEPARATOR" ]
  then
    SEPARATOR=","
fi

# Find the column index of the needle
COLUMN_INDEX=$(awk -F "${SEPARATOR}" -v needle="${COLUMN}" '{ for (i=1; i<=NF; ++i) { if ($i == needle) {print i; exit;} } }' ${INPUT})

if [ -z $COLUMN_INDEX ]; then
  echo "Column not found"
  exit 1
fi

# Write the header line
head -n 1 ${INPUT} > ${OUTPUT}

# Build the sort command
SORT_COMMAND="sort -t "'"'${SEPARATOR}'"'

if [ "${TYPE}" == "date" ]; then
  # The date value for sorting will be put as the first column, see $TYPE = "date"
  SORT_COMMAND="${SORT_COMMAND} -k 1,1"
else
  SORT_COMMAND="${SORT_COMMAND} -k ${COLUMN_INDEX},${COLUMN_INDEX}"
fi

# Reverse order if desc
if [ "${DIRECTION}" == "desc" ]; then
  # Reverse the sorting order
  SORT_COMMAND="${SORT_COMMAND} -r"
fi

# Additional logic for the data type
if [ "${TYPE}" == "numeric" ]; then
  # numeric values
  SORT_COMMAND="${SORT_COMMAND} -n"
fi
if [ "${TYPE}" == "date" ]; then
  # sort by values
  SORT_COMMAND="${SORT_COMMAND} -n"
  # convert the date value to a number, the date format is m/d/yy
  # so we conditionally add a leading 0 and change it to yymmdd so we can sort it as numbers
  # Examples:
  # 2/8/19 -> 190208 / 10/1/19 -> 191001 / 8/22/19 -> 190822
  # And we put it as the first column
  SORT_COMMAND="${SORT_COMMAND} | awk -F "'"'"${SEPARATOR}"'"'" 'BEGIN {OFS = "'"'"${SEPARATOR}"'"'"} {split(\$${COLUMN_INDEX},a,/\//); date=a[3](length(a[1])==1?"'"'"0"'"'"a[1]:a[1])(length(a[2])==1?"'"'"0"'"'"a[2]:a[2]); print date${SEPARATOR}\$0}'"
  # Then after sorting, we remove the first column
  SORT_COMMAND="${SORT_COMMAND} | cut -d'${SEPARATOR}' -f2-"
fi

# Pipe the remaining of the file to sort and append to the OUTPUT
SORT_COMMAND="${SORT_COMMAND} >> ${OUTPUT}"

# Execute the sort command, skip the headers line
tail -n +2 ${INPUT} | bash -c "${SORT_COMMAND}"

exit 0
