// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to building the HTML table
// Note: relies on TABLE_DEBUG variable from the main javascript.js file


// Opens an HTML table, builds headers, and opens the body
// Parameters: showKeywords - boolean on if the keywords column should be displayed
// TODO: Make header labels clickable (sorts table)
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
// TODO: Rework for queue changes
function recordToTable(record, showKeywords, isQueue)
{
  if (TABLE_DEBUG) recordToString(record);
  const queueFunction = isQueue ? "queueRemove" : "queueAdd";

  var recordHTML = `<tr class='tblBody' onclick='${queueFunction}(this)'>`;
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
    recordHTML += buildQueueButton(record, isQueue);
    recordHTML += `</td>`;
  }
  recordHTML += "</tr>";

  return recordHTML;
}

// Creates a button to add the current record to queue
// Parameters: record - Record object to link to queue button
function buildQueueButton(record, isQueue)
{
  if (TABLE_DEBUG) recordToString(record);
  const buttonLabel = isQueue ? "-" : "+";

  const buttonHTML = `<button class="${record.location} ${record.type} queueButton">
                      ${buttonLabel}
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
