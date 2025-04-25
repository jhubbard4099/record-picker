// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to the full Record collection
// Note: relies on DEBUG and TEST_URL variable from the main javascript.js file
//
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k

// Accesses the Google sheet & parses the information into a json object
// Returns the json object representing the full spreadsheet
// TODO: Refactor to only fetch spreadsheet once
async function fetchSheetData()
{
  const sheetID = "1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ";
  const sheetName = "Records";
  const mainURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  const testID = "13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k"
  const testURL = `https://docs.google.com/spreadsheets/d/${testID}/gviz/tq?sheet=${sheetName}`;

  const URL = (TEST_URL) ? testURL : mainURL;

  var sheet = null;

  await fetch(URL).then(response => response.text()).then(data => {

    const jsonBody = (data.split("setResponse(")[1]);
    const jsonText = jsonBody.slice(0, jsonBody.length - 2);
    
    sheet = JSON.parse(jsonText);

  }).catch(error => console.log(error));

  if (DEBUG) console.log(sheet);
  return sheet;
}

// Checks if a row is valid to be turned into a record
// Note: assumes the following row format:
//    Artist - Album - Owned - Genre - Media - Misc
function rowIsValid(row)
{
  // Checks if the artist exists & the record is currently owned
  const isValid = row[0] !== null && row[2].v !== false;

  if (DEBUG && !isValid) console.error("INVALID RECORD");

  return isValid;
}

// Fetches the spreadsheet json, creates records
// for each valid row of the spreadsheet, and stores
// them into the global record collection
async function buildCollection()
{
  const recordCollection = [];
  var sheet = await fetchSheetData();

  // total number of rows to check
  const count = sheet.table.rows.length;

  for(i = 0; i < count; i++)
  {
    var curRow = sheet.table.rows[i].c;
    if (DEBUG) console.log(curRow);

    if(rowIsValid(curRow))
    {
      var curRecord = createRecord(curRow);
      recordCollection.push(curRecord);
      if (DEBUG) recordToString(curRecord);
    }
  }

  return recordCollection;
}

// Reads the global record collection,
// and displays it as a table
// TODO: Find different way to convert to table
// TODO: Make key boxes clickable
// TODO: Display keyword column when there's enough room
async function readCollection(recordCollection)
{
  var outputHTML = "<table>"
  outputHTML += `<tr class="keyHeader">
                  <th class="TBLTraditional">Normal Music</th>
                  <th class="TBLScore">Show & Film Score</th>
                  <th class="TBLCover">VGM Cover</th>
                  <th class="TBLVGM">VGM Score</th>
                  <th class="TBLMisc">Misc</th>
                </tr>`;
  outputHTML += `<tr class="labelHeader">
                  <th colspan="2">Artist</th>
                  <th colspan="3">Album</th>
                </tr>`;
  if (DEBUG) console.log(`Collection size: ${recordCollection.length}`);

  for(i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    if (DEBUG) console.log(`Record #${i+1}:`);
    recordToString(curRecord);

    // Choose class for table coloring
    var recordType = findRecordType(curRecord);

    if(curRecord !== undefined)
    {
      //TODO: <td><button id="queueButton">Submit</button></td>
      outputHTML += `<tr>
                      <td class=${recordType} colspan="2" >${curRecord.album}</td>
                      <td class=${recordType} colspan="3" >${curRecord.artist}</td>
                    </tr>`;
    }
  }

  outputHTML += "</table>";
  document.getElementById("htmlCollection").innerHTML = outputHTML;
}

// Searches the collection and returns all matches
// Parameters:  recordCollection: collection to search
//              searchTerms: comma seperated string of terms
//              isAnd: boolean for if the search terms should be AND'd
// TODO: Add blacklist support
async function searchCollection(recordCollection, searchTerms, isAnd)
{
  const searchedCollection = [];

  if(recordCollection.length === 0 || searchTerms.length === 0)
  {
    return searchedCollection;
  }

  // split terms into an array and trim all whitespace
  const searchArray = searchTerms.split(",");
  for(i = 0; i < searchArray.length; i++)
  {
    searchArray[i] = searchArray[i].trim().toLowerCase();
  }
  if (DEBUG) console.log(searchTerms, searchArray);

  // Iterate through record collection
  for(i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    if (DEBUG) recordToString(curRecord);

    // Normal case: check if the current record contains any of the search terms
    // AND case:    check if the current record contains ALL of the search terms
    if(searchRecord(curRecord, searchArray, isAnd))
    {
      searchedCollection.push(curRecord);
    }
  }

  return searchedCollection;
}