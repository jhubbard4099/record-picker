
// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to UI interaction & HTML
// Note: relies on HTML_DEBUG variable from the main javascript.js file


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
// Parameters: inputSearch    - comma separated string of search terms
//             inputBlacklist - comma separated string of blacklist terms
function htmlSearch(inputSearch, inputBlacklist)
{
  lastFunction = "SEARCH";
  queryCollection(inputSearch, inputBlacklist);
}

// Wrapper function to be called by the HTML
// to show a single random record on button press
// Parameters: inputSearch    - comma separated string of search terms
//             inputBlacklist - comma separated string of blacklist terms
//             inputSeed      - optional field to preset RNG seed
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

// TODO: Add queue support
// TODO: Basic "login" system to allow people to pick a Username
// TODO: Queue control buttons only for me
function htmlQueue()
{
  window.alert("Our dev gnomes are working very hard on this button right now!");
}

// HTML wrapper for when a section of the table key is clicked
// Parameters: recordType - type of record to narrow display down to
function htmlTableKey(recordType)
{
  lastFunction = "TABLE";
  const keySearch = `type:${recordType}`;
  var curSearch = document.getElementById("htmlSearchTerms").value;

  if(curSearch === "")
  {
    if (HTML_DEBUG) console.log("Key Search Default");
    document.getElementById("htmlSearchTerms").value = `type:${recordType}`;
    // simulateTableHover(recordType);
  }
  else if(!curSearch.includes(keySearch))
  {
    if (HTML_DEBUG) console.log("Key Search Add");
    clearAdvancedSearch("type");
    document.getElementById("htmlSearchTerms").value += `, type:${recordType}`;
    // simulateTableHover(recordType);
  }
  else
  {
    if (HTML_DEBUG) console.log("Key Search Remove");
    clearAdvancedSearch("type");
  }
  
  trimAllFields();
  queryCollection(document.getElementById("htmlSearchTerms").value, document.getElementById("htmlBlacklist").value);
}


// Toggles the ANDing of search results
// Also re-runs a search to reflect changes
// Parameters: inputSearch    - comma separated string of search terms
//             inputBlacklist - comma separated string of blacklist terms
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
// Parameters: inputSearch    - comma separated string of search terms
//             inputBlacklist - comma separated string of blacklist terms
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
// Parameters: inputSearch    - comma separated string of search terms
//             inputBlacklist - comma separated string of blacklist terms
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
const queueButton = document.getElementById("queueButton");

const htmlSearchTerms = document.getElementById("htmlSearchTerms");
const htmlBlacklist = document.getElementById("htmlBlacklist");

const htmlIsAnd = document.getElementById("htmlIsAnd");
const htmlIsBlacklist = document.getElementById("htmlIsBlacklist");
const htmlShowKeywords = document.getElementById("htmlShowKeywords");
const clearButton = document.getElementById("clearButton");


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
queueButton.addEventListener("click", () => 
  htmlQueue()
);


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
