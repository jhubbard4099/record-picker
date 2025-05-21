// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to building the HTML table
// Note: relies on TABLE_DEBUG variable from the main javascript.js file


// Opens an HTML table, builds headers, and opens the body
// Parameters: showKeywords - boolean on if the keywords column should be displayed
// TODO: Make header labels clickable (sorts table)
// TODO: Find a way to have key separate AND scroll with screen
function beginCollectionTable(showKeywords)
{
  // Initialize
  var tableHTML = "<table>"

  // 1st header: color key
  tableHTML += `<thead>`;
  tableHTML += `<tr>
                    <th colspan="2" class="colorKey TBLTraditional hoverable" onclick="htmlTableKey('TBLTraditional')">Normal Music</th>
                    <th colspan="2" class="colorKey TBLScore hoverable" onclick="htmlTableKey('TBLScore')">Media Score</th>
                    <th colspan="2" class="colorKey TBLCover hoverable" onclick="htmlTableKey('TBLCover')">VGM Cover</th>
                    <th colspan="2" class="colorKey TBLVGM hoverable" onclick="htmlTableKey('TBLVGM')">VGM Score</th>
                    <th colspan="2" class="colorKey TBLMisc hoverable" onclick="htmlTableKey('TBLMisc')">Misc</th>
                 </tr>`;

  // 2nd header: table key
  if(showKeywords)
  {
    tableHTML += `<tr>
                    <th colspan="2">Artist</th>
                    <th colspan="3">Album</th>
                    <th colspan="3">Keywords</th>
                    <th colspan="2">Queue</th>
                  </tr>`;
  }
  else
  {
    tableHTML += `<tr>
                    <th colspan="3">Artist</th>
                    <th colspan="5">Album</th>
                    <th colspan="2">Queue</th>
                  </tr>`;
  }

  // Open table body
  tableHTML += `</thead>
                 <tbody>`;

  return tableHTML;
}

// Converts a record to HTML to be added to the full table
// Parameters: record       - record object to convert
//             showKeywords - boolean on if the keywords column should be displayed
function recordToTable(record, showKeywords)
{
  if (TABLE_DEBUG) recordToString(record);

  var recordHTML = "<tr class='tblBody' onclick='queueAdd(this)'>";
  if(record !== undefined)
  {
    // Dynamically add current record to the table
    if(showKeywords)
    {
      recordHTML += `<td colspan="2" class="tblExpandedArtist ${record.type}">${record.album}</td>
                     <td colspan="3" class="tblExpandedAlbum ${record.type}">${record.artist}</td>
                     <td colspan="3" class="tblExpandedKeywords ${record.type}">${record.keywords.join(", ")}</td>`;
    }
    else
    {
      recordHTML += `<td colspan="3" class="tblStandardArtist ${record.type}">${record.album}</td>
                     <td colspan="5" class="tblStandardAlbum ${record.type}">${record.artist}</td>`;
    }

    recordHTML += `<td colspan="2" class="${record.type}">`
    recordHTML += buildQueueButton(record);
    recordHTML += `</td>`;
  }
  recordHTML += "</tr>";

  return recordHTML;
}

// Creates a button to add the current record to queue
// Parameters: record - Record object to link to queue button
// TODO: Remove recordID?
function buildQueueButton(record)
{
  const recordID = `${record.artist}-${record.album}`;
  if (TABLE_DEBUG) console.log(`Record ID: ${recordID}`);
  if (TABLE_DEBUG) recordToString(record);

  const buttonHTML = `<button id="${recordID}" 
                      class="${record.location} ${record.type} queueButton">
                      +
                      </button>`;

  return buttonHTML;
}

// Closes an HTML table's body and the main table
function endCollectionTable()
{
  // Close table body
  tableHTML = `</tbody>
                </table>`;
  
  return tableHTML;
}

// Adds the record at the current row to the "queue"
// Currently, just replaces the button text with it's location
// Parameters: row - table row representing a record to add
// 
// Note: Assumes the following row format(s):
//    Artist - Album - Button
//    Artist - Album - Keywords - Button
// TODO: Update once proper queue handling is implemented
function queueAdd(row)
{
  console.log(row);

  // Convert row json into cell array
  const cells = row.cells;

  const artist = cells[0].textContent;
  const album = cells[1].textContent;
  var button = undefined;
  var keywords = undefined;

  // Fetch button depending on number of table columns
  if(cells.length === 3)
  {
    button = cells[2].getElementsByTagName('button')[0];
  }
  else // cells.length === 4
  {
    keywords = cells[2].textContent;
    button = cells[3].getElementsByTagName('button')[0];
  }

  // Button classes: location RecordType queueButton
  const buttonClasses = button.className.split(" ");
  const location = buttonClasses[0];

  if (TABLE_DEBUG) console.log(`    Artist: ${artist}
    Album: ${album}
    Button ID: ${button.id}
    Location: ${location}
    Keywords: ${keywords}`);

  button.textContent = location;
}
