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
  // Declare scraper variables
  const sheetID = "1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ";
  const sheetName = "Records";
  const mainURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  const testID = "13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k"
  const testURL = `https://docs.google.com/spreadsheets/d/${testID}/gviz/tq?sheet=${sheetName}`;

  const URL = (TEST_URL) ? testURL : mainURL;

  var sheet = null;

  // Retrieve webpage, then trim it down to just the spreadsheet
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

  // Iterate through spreadsheet rows
  for(var i = 0; i < count; i++)
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
// Parameters:  recordCollection - collection to display as a table
//              showKeywords - boolean on if the keywords column should be displayed
//              recordIndex - optional field if just a single record should be displayed
// TODO: Make key boxes clickable
async function readCollection(recordCollection, showKeywords)
{
  if (DEBUG) console.log(`Collection size: ${recordCollection.length} | Show Keywords: ${showKeywords}`);

  // Only display if there are actually records to show
  if(recordCollection.length <= 0)
  {
    clearCollection();
    return;
  }

  // Begin building record table
  var outputHTML = beginCollectionTable(showKeywords);

  // Convert each record to HTML and add to output
  for(var i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    if (DEBUG) console.log(`Record #${i+1}:`);
    
    outputHTML += recordToTable(curRecord, showKeywords);
  }
  outputHTML += endCollectionTable();

  document.getElementById("htmlCollection").innerHTML = outputHTML;
}

// Converts an input string (comma separated list) to an array
// Parameters:  inputString - comma separated string list
// Returns:     an array of strings
function stringToArray(inputString)
{
  // Return empty string if input is undefined or empty
  if(inputString === undefined || inputString === "")
  {
    if (DEBUG) console.log("returning empty array");
    return [];
  }

  // Split and trim all whitespace from input string
  var outputArray = inputString.split(",");
  for(var i = 0; i < outputArray.length; i++)
  {
    outputArray[i] = outputArray[i].trim().toLowerCase();
  }

  if (DEBUG) console.log(`input: ${inputString} | output: ${outputArray}`);

  return outputArray;
}

// Searches the collection and returns all matches
// Parameters:  recordCollection: collection to search
//              searchTerms: comma seperated string of terms
//              isAnd: boolean for if the search terms should be AND'd
async function searchCollection(recordCollection, searchTerms, blacklist, isAnd)
{
  const searchedCollection = [];

  // Return empty collection if input is empty or BOTH input fields are
  if(recordCollection.length === 0 || (searchTerms === "" && blacklist === ""))
  {
    return searchedCollection;
  }

  // split terms into an array and trim all whitespace
  const searchArray = stringToArray(searchTerms);
  const blacklistArray = stringToArray(blacklist);

  // Iterate through record collection
  for(var i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    if (DEBUG) recordToString(curRecord);

    // Normal case: check if the current record contains any of the search terms
    // AND case:    check if the current record contains ALL of the search terms
    if(searchRecord(curRecord, searchArray, isAnd) && !isRecordOnBlacklist(curRecord, blacklistArray))
    {
      if (DEBUG) console.warn("Pushing record to collection");
      searchedCollection.push(curRecord);
    }
  }

  return searchedCollection;
}

// Runs any queries involving reading in the record collection
// This includes Browse, Search, and Random
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
//              inputSeed: optional field to determine which record to read
async function queryCollection(inputSearch, inputBlacklist, inputSeed=-1)
{
  var recordCollection = await buildCollection();
  
  // Read state of the "AND results" checkbox
  const inputIsAnd = document.getElementById("htmlIsAnd").checked;

  // Read state of the "Show Keywords" checkbox
  const inputShowKeywords = document.getElementById("htmlShowKeywords").checked;

  if (DEBUG) console.log(`SEARCH: ${inputSearch} | BLACKLIST: ${inputBlacklist} | AND: ${inputIsAnd} | KEYWORDS: ${inputShowKeywords}`)

  // Ignore blacklist if it isn't shown
  if(!isBlacklistVisible())
  {
    inputBlacklist = "";
  }

  // Check if we need to search the collection
  if(lastFunction === "SEARCH" || inputSearch !== "" || inputBlacklist !== "")
  {
    if (DEBUG) console.log("Search Query");
    recordCollection = await searchCollection(recordCollection, inputSearch, inputBlacklist, inputIsAnd);
  }

  // Check if we need to replace collection with a random record
  if(lastFunction === "RANDOM")
  {
    if (DEBUG) console.log("Random Query");
    var randomRecord = "";

    // If no seed was input, use global seed
    if(inputSeed !== -1)
    {
      recordCollection = [recordCollection[inputSeed]];
    }
    else
    {
      rngSeed = Math.floor(Math.random() * recordCollection.length);
      recordCollection = [recordCollection[rngSeed]];
    }
  }
  
  readCollection(recordCollection, inputShowKeywords);
}

// Clears all HTML from the collection table
function clearCollection()
{
  document.getElementById("htmlCollection").innerHTML = "";
}
