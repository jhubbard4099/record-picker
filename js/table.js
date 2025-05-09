// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to building the HTML table
// Note: relies on TABLE_DEBUG variable from the main javascript.js file


// Opens an HTML table, builds headers, and opens the body
// Parameters: showKeywords - boolean on if the keywords column should be displayed
// TODO: Make header labels clickable - sorts table
function beginCollectionTable(showKeywords)
{
  // Initialize
  var tableHTML = "<table>"

  // 1st header: color key
  tableHTML += `<thead>`;
  tableHTML += `<tr>
                    <th class="colorKey TBLTraditional" onclick="htmlTableKey('TBLTraditional')">Normal Music</th>
                    <th class="colorKey TBLScore" onclick="htmlTableKey('TBLScore')">Media Score</th>
                    <th class="colorKey TBLCover" onclick="htmlTableKey('TBLCover')">VGM Cover</th>
                    <th class="colorKey TBLVGM" onclick="htmlTableKey('TBLVGM')">VGM Score</th>
                    <th class="colorKey TBLMisc" onclick="htmlTableKey('TBLMisc')">Misc</th>
                 </tr>`;

  // 2nd header: table key
  if(showKeywords)
  {
    tableHTML += `<tr class="labelHeader">
                    <th colspan="1">Artist</th>
                    <th colspan="2">Album</th>
                    <th colspan="2">Keywords</th>
                  </tr>`;
  }
  else
  {
    tableHTML += `<tr class="labelHeader">
                    <th colspan="2">Artist</th>
                    <th colspan="3">Album</th>
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
// TODO: Add to Queue button
function recordToTable(record, showKeywords)
{
  if (TABLE_DEBUG) recordToString(record);

  var recordHTML = "<tr>";
  if(record !== undefined)
  {
    // Dynamically add current record to the table
    // TODO: <td><button id="queueButton">Submit</button></td>
    if(showKeywords)
    {
      recordHTML += `<td colspan="1" class="tblExpandedArtist ${record.type}">${record.album}</td>
                     <td colspan="2" class="tblExpandedAlbum ${record.type}">${record.artist}</td>
                     <td colspan="2" class="tblExpandedKeywords ${record.type}">${record.keywords.join(", ")}</td>`;
    }
    else
    {
      recordHTML += `<td colspan="2" class="tblStandardArtist ${record.type}">${record.album}</td>
                     <td colspan="3" class="tblStandardAlbum ${record.type}">${record.artist}</td>`;
    }
  }
  recordHTML += "</tr>";

  return recordHTML;
}

// Closes an HTML table's body and the main table
function endCollectionTable()
{
  // Close table body
  tableHTML = `</tbody>
                </table>`;
  
  return tableHTML;
}
