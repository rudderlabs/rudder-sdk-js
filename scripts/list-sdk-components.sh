#!/bin/bash

# Get arguments
BUCKET_NAME=$1
DIRECTORY_PATH=$2
OUTPUT_HTML_FILE_NAME=$3
OUTPUT_HTML_DIR_PATH=$4
COMPONENT_NAME=$5
ZIP_FILE_NAME=$6

OUTPUT_HTML_FILE_PATH="$OUTPUT_HTML_DIR_PATH/$OUTPUT_HTML_FILE_NAME"

# List of files to exclude
# Exclude the ZIP file and the output HTML file as they'll be
# in the same directory as the other files
EXCLUDED_FILES=($ZIP_FILE_NAME $OUTPUT_HTML_FILE)

# Function to check if a file is in the excluded list
is_excluded() {
  local file=$1
  for excluded in "${EXCLUDED_FILES[@]}"; do
    if [[ "$file" == "$excluded" ]]; then
      return 0 # File is in the excluded list
    fi
  done
  return 1 # File is not in the excluded list
}

# Get list of files from S3 (non-recursive)
# Capture the timestamp, file size, and file name for each file
FILES=$(aws s3 ls s3://$BUCKET_NAME/$DIRECTORY_PATH/ | awk '{print $1, $2, $4}')

# Start creating HTML file
echo "<!DOCTYPE html>" > $OUTPUT_HTML_FILE_PATH
echo "<html>" >> $OUTPUT_HTML_FILE_PATH
echo "<head><title>S3 File List</title></head>" >> $OUTPUT_HTML_FILE_PATH
echo "<body>" >> $OUTPUT_HTML_FILE_PATH
echo "<h1>RudderStack JavaScript SDK - $COMPONENT_NAME</h1>" >> $OUTPUT_HTML_FILE_PATH
echo "<p><a href=\"https://$BUCKET_NAME.s3.amazonaws.com/$DIRECTORY_PATH/$ZIP_FILE_NAME\" download><button>Download All Files</button></a></p>" >> $OUTPUT_HTML_FILE_PATH
echo "<table>" >> $OUTPUT_HTML_FILE_PATH
echo "<tr><th>#</th><th>File Name</th><th>Last Updated</th></tr>" >> $OUTPUT_HTML_FILE_PATH

# Counter for serial number
COUNTER=1

# Add each file as a table row
while IFS= read -r LINE; do
  TIMESTAMP=$(echo $LINE | awk '{print $1, $2}')
  FILE=$(echo $LINE | awk '{print $3}')
  URL="https://$BUCKET_NAME.s3.amazonaws.com/$DIRECTORY_PATH/$FILE"

  # Check if the file is in the excluded list
  if is_excluded "$FILE"; then
    continue # Skip this file
  fi

  # Remove the .min.js or .min.js.map extension for display
  FILE_DISPLAY=$(basename "$FILE" | sed 's/\.min\.js$//' | sed 's/\.min\.js\.map$//' | sed 's/\\.js$//' | sed 's/\\.js\.map$//')

  if [[ "$FILE" == *.min.js.map || "$FILE" == *.js.map ]]; then
    # Indent map files
    echo "<tr><td></td><td style=\"padding-left: 20px;\"><a href=\"$URL\">Source Map</a></td><td>$TIMESTAMP</td></tr>" >> $OUTPUT_HTML_FILE_PATH
  else
    # Add JS files with serial number
    echo "<tr><td>$COUNTER</td><td><a href=\"$URL\">$FILE_DISPLAY</a></td><td>$TIMESTAMP</td></tr>" >> $OUTPUT_HTML_FILE_PATH
    COUNTER=$((COUNTER + 1))
  fi
done <<< "$FILES"

# Finish HTML file
echo "</table>" >> $OUTPUT_HTML_FILE_PATH
echo "</body>" >> $OUTPUT_HTML_FILE_PATH
echo "</html>" >> $OUTPUT_HTML_FILE_PATH

echo "HTML file with links to S3 files has been generated: $OUTPUT_HTML_FILE_PATH"
