// Website for browsing & selecting from my vinyl record collection
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k

// Object representing a vinyl record
// Parameters:  album - string representing the album name
//              artist - string representing the artist of the album
//              keywords - array of strings including genre & other relevant info
function Record(album, artist, keywords)
{
  this.album = album;
  this.artist = artist;
  this.keywords = keywords;
}

// Convert record to a printable string, which is also sent to the console
function recordToString(record)
{
  var recordString = `Album: ${record.album}\nArtist: ${record.artist}\nKeywords: ${record.keywords}`;
  console.log(recordString);
  return recordString
}

// Create a record object from input spreadsheet row
// Note: assumes the following row format:
//    Artist - Album - Owned - Genre - Media - Misc
function createRecord(row)
{
  // fetch album and artist strings
  var curAlbum = row[0].v;
  var curArtist = row[1].v;

  // fetch genre, media, and misc strings,
  // then split them into arrays
  var curGenre = row[3].v.split(", ");
  var curMedia = row[4].v.split(", ");
  var curMisc = row[5].v.split(", ");
  
  // build keywords based on what sections aren't empty
  var curKeywords = curGenre;
  if(curMedia[0] !== " ")
  {
    curKeywords = curKeywords.concat(curMedia);
  } 
  if(curMisc[0] !== " ")
  {
    curKeywords = curKeywords.concat(curMisc);
  }

  // build and return a Record object
  return new Record(curAlbum, curArtist, curKeywords);
}

// Checks if a row is valid to be turned into a record
// Note: assumes the following row format:
//    Artist - Album - Owned - Genre - Media - Misc
function rowIsValid(row)
{
  // Checks if the artist exists & the record is currently owned
  return (row[0] !== null && row[2].v !== false);
}

// Accesses the Google sheet & parses the information into a json object
// Returns the json object representing the full spreadsheet
async function fetchSheetData()
{
  const sheetID = "1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ";
  const sheetName = "Records";
  const URL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  const testID = "13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k"
  const testURL = `https://docs.google.com/spreadsheets/d/${testID}/gviz/tq?sheet=${sheetName}`;

  var sheet = null;

  await fetch(testURL).then(response => response.text()).then(data => {

    const jsonBody = (data.split("setResponse(")[1]);
    const jsonText = jsonBody.slice(0, jsonBody.length - 2);
    
    sheet = JSON.parse(jsonText);

  }).catch(error => console.log(error));

  console.log(sheet);
  return sheet;
}

// Fetches the spreadsheet json, creates records
// for each valid row of the spreadsheet, and stores
// them into the global record collection
async function buildCollection()
{
  const recordCollection = [];
  var sheet = await fetchSheetData();
  console.log(sheet);

  // total number of rows to check
  const count = sheet.table.rows.length;

  for(i = 0; i < count; i++)
  {
    var curRow = sheet.table.rows[i].c;
    console.log(curRow);

    if(rowIsValid(curRow))
    {
      var curRecord = createRecord(curRow);
      recordCollection.push(curRecord);
      //recordToString(curRecord);
    }
  }

  return recordCollection;
}

// Reads the global record collection, and
// displays it as a table
async function readCollection(recordCollection)
{
  console.log(recordCollection.length);
  for(i = 0; i < recordCollection.length; i++)
  {
    console.log(i);
    recordToString(recordCollection[i]);
  }
}

async function main()
{
  var temp = new Record("A Very Mary Cliffmas", "Cliff King", ["christmas", "holiday", "parody"]);
  recordToString(temp);

  var recordCollection = await buildCollection();
  readCollection(recordCollection);
}

main();