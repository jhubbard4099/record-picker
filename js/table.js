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
                    <th colspan="2" class="colorKey TBLTraditional" onclick="htmlTableKey('TBLTraditional')">Normal Music</th>
                    <th colspan="2" class="colorKey TBLScore" onclick="htmlTableKey('TBLScore')">Media Score</th>
                    <th colspan="2" class="colorKey TBLCover" onclick="htmlTableKey('TBLCover')">VGM Cover</th>
                    <th colspan="2" class="colorKey TBLVGM" onclick="htmlTableKey('TBLVGM')">VGM Score</th>
                    <th colspan="2" class="colorKey TBLMisc" onclick="htmlTableKey('TBLMisc')">Misc</th>
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
// TODO: "Add to Queue" button
function recordToTable(record, showKeywords)
{
  if (TABLE_DEBUG) recordToString(record);

  var recordHTML = "<tr class='tblBody'>";
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

// TODO: Replace with clicking the row to add
// Creates a button to add the current record to queue
// Parameters: record - Record object to link to queue button
function buildQueueButton(record)
{
  const recordID = `${record.artist}-${record.album}`;
  if (TABLE_DEBUG) console.log(`Record ID: ${recordID}`);
  if (TABLE_DEBUG) recordToString(record);

  // TODO
  // const buttonHTML = `<button id="${recordID}" 
  //                     class="queueButton ${record.type}" 
  //                     onclick="queueAdd('${recordCopy}')">
  //                       Add
  //                     </button>`;

const buttonHTML = `<button id="${recordID}" 
                      class="queueButton ${record.type}" 
                      onclick="this.textContent = '${record.location}'">
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

// TODO
// function queueAdd(record)
// {
//   const recordID = `${record.artist}-${record.album}`;
  
//   if (TABLE_DEBUG) console.log(`Adding location ${record.location} from record ${recordID}`);
//   if (TABLE_DEBUG) recordToString(record);

//   var button = document.getElementById(recordID);
//   button.value = record.location;
// }
// function queueAdd(recordID, location)
// {
//   if (TABLE_DEBUG) console.log(`Adding location ${location} from record ${recordID}`);
  
//   var button = document.getElementById(recordID);
//   button.value = location;
// }
