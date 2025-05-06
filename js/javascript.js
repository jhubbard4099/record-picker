// Website for browsing & selecting from my vinyl record collection
// This file handles all direct interaction with the front end
//
// Breakdown of helper files:
//    record.js - all functions specific to the Record objects
//    collection.js - all functions specific to the collection of Record objects

// Testing constants
const TEST_URL = false;
const HTML_DEBUG = false;
const COLLECTION_DEBUG = false;
const TABLE_DEBUG = false;
const RECORD_DEBUG = false;

// Global variables
var lastFunction = "CLEAR";
var rngSeed = -1;

// Determines if the blacklist bar is currently displayed
// Returns: true if visible, false otherwise
function isBlacklistVisible()
{
  if (HTML_DEBUG) console.log(`Blacklist Visibility: ${document.getElementById("htmlBlacklist").style.visibility}`);
  return document.getElementById("htmlBlacklist").style.visibility === "visible";
}

// Removes all extraneous commas from input string
// Parameters:  inputField: string to trim
// Returns:     trimmed string
function trimField(inputField)
{
  // Remove all leading/trailing commas
  inputField = inputField.replace(/(^[,\s]+)|([,\s]+$)/g, '');

  // Removes all inner commas
  while(inputField.includes(", ,"))
  {
    inputField = inputField.replace(", ,", ",");
  }

  return inputField;
}

// Removes extaneous commas from all user input fields
function trimAllFields()
{
  var curSearch = document.getElementById("htmlSearchTerms").value;
  var curBlacklist = document.getElementById("htmlBlacklist").value;
  
  curSearch = trimField(curSearch);
  curBlacklist = trimField(curBlacklist);

  document.getElementById("htmlSearchTerms").value = curSearch;
  document.getElementById("htmlBlacklist").value = curBlacklist;
}

  
// Wrapper function to be called by the HTML
// to display the collection on button press
// TODO: Color each row dependent on either artist or game
function htmlBrowse()
{
  lastFunction = "READ";
  queryCollection("", "");
}

// Wrapper function to be called by the HTML
// to search the collection on button press
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlSearch(inputSearch, inputBlacklist)
{
  lastFunction = "SEARCH";
  queryCollection(inputSearch, inputBlacklist);
}

// Wrapper function to be called by the HTML
// to show a single random record on button press
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
//              inputSeed: optional field to preset RNG seed
function htmlRandom(inputSearch, inputBlacklist, inputSeed=-1)
{
  lastFunction = "RANDOM";

  if (HTML_DEBUG) console.log(`RNGTERMS: ${inputSearch} | RNGBLACKLIST: ${inputBlacklist}`);
  if (HTML_DEBUG) console.log(`Global RNG: ${rngSeed} | Local RNG: ${inputSeed}`);

  queryCollection(inputSearch, inputBlacklist, inputSeed);
}

// HTML wrapper function to clear all fields
function htmlClear()
{
  lastFunction = "CLEAR";

  // Reset all UI elements
  document.getElementById("htmlSearchTerms").value = "";
  document.getElementById("htmlBlacklist").value = "";
  document.getElementById("htmlBlacklist").style.visibility = "hidden";

  document.getElementById("htmlIsAnd").checked = false;
  document.getElementById("htmlIsBlacklist").checked = false;
  document.getElementById("htmlShowKeywords").checked = false;
  
  // Clear record display
  clearCollection();
}

// TODO: Basic "login" system to allow people to pick a Username
// TODO: Queue control buttons only for me
function htmlQueue()
{
  window.alert("Our dev gnomes are working very hard on this button right now!");
}

// HTML wrapper for when a section of the table key is clicked
// Parameters:  recordType: type of record to narrow display down to
function htmlTableKey(recordType)
{
  lastFunction = "TABLE";
  const keySearch = `type:${recordType}`;
  const curSearch = document.getElementById("htmlSearchTerms").value;

  if(curSearch === "")
  {
    if (HTML_DEBUG) console.log("Key Search Default");
    document.getElementById("htmlSearchTerms").value = `type:${recordType}`;
  }
  else if(!curSearch.includes(keySearch))
  {
    if (HTML_DEBUG) console.log("Key Search Add");
    document.getElementById("htmlSearchTerms").value += `, type:${recordType}`;
  }
  else
  {
    if (HTML_DEBUG) console.log("Key Search Remove");
    document.getElementById("htmlSearchTerms").value = curSearch.replace(keySearch, "");
  }
  
  trimAllFields();
  queryCollection(document.getElementById("htmlSearchTerms").value, document.getElementById("htmlBlacklist").value);
}


// Toggles the ANDing of search results
// Also re-runs a search to reflect changes
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlANDToggle(inputSearch, inputBlacklist)
{
  // Re-run search
  if(lastFunction === "SEARCH" || lastFunction === "TABLE")
  {
    htmlSearch(inputSearch, inputBlacklist);
  }
}

// Toggles visibility of the blacklist bar
// Also re-runs a search to reflect change in blacklist visibility
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlBlacklistToggle(inputSearch, inputBlacklist)
{
  if(isBlacklistVisible())
  {
    document.getElementById("htmlBlacklist").style.visibility = "hidden";
  }
  else
  {
    document.getElementById("htmlBlacklist").style.visibility = "visible";
  }

  // Re-run search
  if(lastFunction === "SEARCH" || lastFunction === "TABLE")
  {
    htmlSearch(inputSearch, inputBlacklist);
  }
}

// HTML wrapper function to re-run the most recent action,
// now with keywords either enabled or disabled
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlKeywordToggle()
{
  if (HTML_DEBUG) console.log(`Keyword Display: ${lastFunction}`);

  // Read state of the "Show Keywords" checkbox
  const inputShowKeywords = document.getElementById("htmlShowKeywords").checked;

  readCollection(lastCollection, inputShowKeywords);
}


// Element declarations
const browseButton = document.getElementById("browseButton");
const searchButton = document.getElementById("searchButton");
const randomButton = document.getElementById("randomButton");
const clearButton = document.getElementById("clearButton");
// const queueButton = document.getElementById("queueButton");

const htmlSearchTerms = document.getElementById("htmlSearchTerms");
const htmlBlacklist = document.getElementById("htmlBlacklist");

const htmlIsAnd = document.getElementById("htmlIsAnd");
const htmlIsBlacklist = document.getElementById("htmlIsBlacklist");
const htmlShowKeywords = document.getElementById("htmlShowKeywords");


// Browse button functionality
browseButton.addEventListener("click", () => 
  htmlBrowse()
);

// Search button functionality
searchButton.addEventListener("click", () => 
  htmlSearch(htmlSearchTerms.value, htmlBlacklist.value)
);

// Random button functionality
randomButton.addEventListener("click", () => 
  htmlRandom(htmlSearchTerms.value, htmlBlacklist.value)
);

// Clear button functionality
clearButton.addEventListener("click", () => 
  htmlClear()
);

// Queue button functionality
// queueButton.addEventListener("click", () => 
//   htmlQueue()
// );


// Listener for typing in the search bar
htmlSearchTerms.addEventListener("keyup", (e) => 
  htmlSearch(e.target.value, htmlBlacklist.value)
);

// Listener for typing in the blacklist bar
htmlBlacklist.addEventListener("keyup", (e) => 
  htmlSearch(htmlSearchTerms.value, e.target.value)
);


// Listener for AND checkbox
htmlIsAnd.addEventListener("click", () => 
  htmlANDToggle(htmlSearchTerms.value, htmlBlacklist.value)
);

// Listener for blacklist checkbox
htmlIsBlacklist.addEventListener("click", () => 
  htmlBlacklistToggle(htmlSearchTerms.value, htmlBlacklist.value)
);

// Listener for keywords checkbox
htmlShowKeywords.addEventListener("click", () => 
  htmlKeywordToggle()
);


// Tests various parts of the website functionality
async function test()
{
  var temp = new Record("A Very Mary Cliffmas", "Cliff King", ["christmas", "holiday", "parody"]);
  if (HTML_DEBUG) recordToString(temp);

  const recordCollection = await buildCollection();
  //readCollection(recordCollection);

  //const searchTest = searchCollection(recordCollection, "metal, test,everhood, Helynt", false);
  const searchTest = searchCollection(recordCollection, "electronic, techno", true);

  readCollection(searchTest);
}
//test();
