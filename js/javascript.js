// Website for browsing & selecting from my vinyl record collection
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k

// Wait to do anything until page is loaded
window.onload=function(){

const DEBUG = true;
const TEST_URL = true;

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
  var recordString = "";

  if(record !== undefined)
  {
    recordString = `Album: ${record.album}\nArtist: ${record.artist}\nKeywords: ${record.keywords}`;
  }

  //if (DEBUG) console.log(recordString);
  
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
  // TODO: use trim()?
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
  const isValid = row[0] !== null && row[2].v !== false;

  if (DEBUG && !isValid) console.error("INVALID RECORD");

  return isValid;
}

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

// Fetches the spreadsheet json, creates records
// for each valid row of the spreadsheet, and stores
// them into the global record collection
async function buildCollection()
{
  const recordCollection = [];
  var sheet = await fetchSheetData();
  if (DEBUG) console.log(sheet);

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
      //if (DEBUG) recordToString(curRecord);
    }
  }

  return recordCollection;
}

// Reads the global record collection,
// and displays it as a table
// TODO: Find different way to convert to table
async function readCollection(recordCollection)
{
  var outputHTML = "<table border='2px' width='400'>";
  if (DEBUG) console.log(`Collection size: ${recordCollection.length}`);

  for(i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    //if (DEBUG) console.log(`Record #${i+1}:`);
    recordToString(curRecord);

    if(curRecord !== undefined)
    {
      outputHTML += `<tr>
                      <td>${curRecord.album}</td>
                      <td>${curRecord.artist}</td>
                      <td>${curRecord.keywords}</td>
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
// TODO: Break out smaller record search function
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

  // Iterate through collection and through search terms
  for(i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];
    var isAndMatch = true;

    if (DEBUG) recordToString(curRecord);

    for(j = 0; j < searchArray.length; j++)
    {
      curSearch = searchArray[j];
      if(curRecord.album.toLowerCase().includes(curSearch) != false ||
         curRecord.artist.toLowerCase().includes(curSearch) != false ||
         curRecord.keywords.findIndex(element => element.includes(curSearch)) != -1)
      {
        if(!isAnd)
        {
          if (DEBUG) console.warn("Match found!");
          searchedCollection.push(curRecord);
          break;
        }
      }
      else
      {
        var isAndMatch = false;
      }
    }

    if(isAnd && isAndMatch)
    {
      if (DEBUG) console.warn("Match found!");
      searchedCollection.push(curRecord);
    }
  }

  return searchedCollection;
}

// Wrapper function to be called by the HTML
// to display the collection on button press
// TODO: Color each row dependent on either artist or game
async function htmlReadCollection()
{
  var recordCollection = await buildCollection();
  readCollection(recordCollection);
}

// Wrapper function to be called by the HTML
// to search the collection on button press
async function htmlSearchCollection(inputSearch)
{
  var recordCollection = await buildCollection();

  // Read state of the "AND results" checkbox
  const inputIsAnd = document.getElementById("htmlIsAnd").checked;

  if (DEBUG) console.log(`TERMS: ${inputSearch} | AND: ${inputIsAnd}`)

  const searchedCollection = await searchCollection(recordCollection, inputSearch, inputIsAnd);
  readCollection(searchedCollection);
}

// Wrapper function to be called by the HTML
// to show a single random record on button press
async function htmlRandomRecord(inputSearch)
{
  var recordCollection = await buildCollection();
  var randomNum = 0;
  var randomRecord = [];

  // Read state of the "AND results" checkbox
  const inputIsAnd = document.getElementById("htmlIsAnd").checked;

  if(inputSearch != "")
  {
    if (DEBUG) console.log("Random with Search")
    const searchedCollection = await searchCollection(recordCollection, inputSearch, inputIsAnd);
    randomNum = Math.floor(Math.random() * searchedCollection.length);
    randomRecord = [searchedCollection[randomNum]];
  }
  else
  {
    if (DEBUG) console.log("Random without Search")
    randomNum = Math.floor(Math.random() * recordCollection.length);
    randomRecord = [recordCollection[randomNum]];
  }

  if (DEBUG) console.log(`TERMS: ${inputSearch} | AND: ${inputIsAnd} | RNG: ${randomNum}`)
  readCollection(randomRecord);
}

async function test()
{
  var temp = new Record("A Very Mary Cliffmas", "Cliff King", ["christmas", "holiday", "parody"]);
  if (DEBUG) recordToString(temp);

  const recordCollection = await buildCollection();
  //readCollection(recordCollection);

  //const searchTest = await searchCollection(recordCollection, "metal, test,everhood, Helynt", false)
  const searchTest = await searchCollection(recordCollection, "electronic, techno", true)

  readCollection(searchTest);
}
//test();

// Browse button functionality
const browseButton = document.getElementById("browseButton")
browseButton.addEventListener("click", htmlReadCollection);

// Random button functionality
const randomButton = document.getElementById("randomButton")
randomButton.addEventListener("click", (e) => {
  // get value of input field first
  htmlRandomRecord(htmlSearchTerms.value);
});

// Search form functionality
const htmlSearchTerms = document.getElementById("htmlSearchTerms")
const htmlIsAnd = document.getElementById("htmlIsAnd")

// Listener for AND checkbox
htmlIsAnd.addEventListener("click", (e) => {
  // get value of input field first
  htmlSearchCollection(htmlSearchTerms.value);
});

// Listener for typing in the search bar
htmlSearchTerms.addEventListener("keyup", (e) => htmlSearchCollection(e.target.value));

}