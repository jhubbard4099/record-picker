// Website for browsing & selecting from my vinyl record collection
// This file handles all direct interaction with the front end
//
// Breakdown of helper files:
//    record.js - all functions specific to the Record objects
//    collection.js - all functions specific to the collection of Record objects
// TODO: Code cleanup
// TODO: Comment cleanup

// Testing constants
const DEBUG = false;
const TEST_URL = false;

// Variables used for the Show Keywords toggle
var lastFunction = "CLEAR";
var rngSeed = -1;

// Determines if the blacklist bar is currently displayed
// Returns: true if visible, false otherwise
function isBlacklistVisible()
{
  if (DEBUG) console.log(`Blacklist Visibility: ${document.getElementById("htmlBlacklist").style.visibility}`)
  return document.getElementById("htmlBlacklist").style.visibility === "visible";
}

// Wait to do anything until page is loaded
window.onload=function(){


// Wrapper function to be called by the HTML
// to display the collection on button press
// TODO: Color each row dependent on either artist or game
// TODO: Combine into htmlQueryCollection
async function htmlBrowse()
{
  lastFunction = "READ";
  queryCollection("", "");
}

// Wrapper function to be called by the HTML
// to search the collection on button press
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
async function htmlSearch(inputSearch, inputBlacklist)
{
  lastFunction = "SEARCH";
  queryCollection(inputSearch, inputBlacklist);
}

// Wrapper function to be called by the HTML
// to show a single random record on button press
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
//              inputSeed: optional field to preset RNG seed
async function htmlRandom(inputSearch, inputBlacklist, inputSeed=-1)
{
  lastFunction = "RANDOM";

  if (DEBUG) console.log(`RNGTERMS: ${inputSearch} | RNGBLACKLIST: ${inputBlacklist}`)
  if (DEBUG) console.log(`Global RNG: ${rngSeed} | Local RNG: ${inputSeed}`)

  await queryCollection(inputSearch, inputBlacklist, inputSeed)
}

// Toggles visibility of the blacklist bar
// Also re-runs a search to reflect change in blacklist visibility
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlBlacklistToggle(inputSearch, inputBlacklist)
{
  lastFunction = "SEARCH";

  if(isBlacklistVisible())
  {
    document.getElementById("htmlBlacklist").style.visibility = "hidden";
  }
  else
  {
    document.getElementById("htmlBlacklist").style.visibility = "visible";
  }

  // Re-run search
  queryCollection(inputSearch, inputBlacklist)
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

// HTML wrapper function to re-run the most recent action,
// now with keywords either enabled or disabled
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
function htmlKeywordToggle(inputSearch, inputBlacklist)
{
  if (DEBUG) console.log(`Keyword Display: ${lastFunction}`)

  if(lastFunction === "READ")
  {
    htmlBrowse();
  }
  else if(lastFunction === "SEARCH")
  {
    htmlSearch(inputSearch, inputBlacklist);
  }
  else if(lastFunction === "RANDOM")
  {
    htmlRandom(inputSearch, inputBlacklist, rngSeed);
  }
  else
  {
    // Do nothing
  }
}

// TODO
function htmlDisplayQueue()
{
  window.alert("Our dev gnomes are working very hard on this button right now!");
}


// Element declarations
const browseButton = document.getElementById("browseButton")
const searchButton = document.getElementById("searchButton")
const randomButton = document.getElementById("randomButton")
const clearButton = document.getElementById("clearButton")
//const queueButton = document.getElementById("queueButton")

const htmlSearchTerms = document.getElementById("htmlSearchTerms")
const htmlBlacklist = document.getElementById("htmlBlacklist")

const htmlIsAnd = document.getElementById("htmlIsAnd")
const htmlIsBlacklist = document.getElementById("htmlIsBlacklist")
const htmlShowKeywords = document.getElementById("htmlShowKeywords")


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
//   htmlDisplayQueue()
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
  htmlSearch(htmlSearchTerms.value, htmlBlacklist.value)
);

// Listener for blacklist checkbox
htmlIsBlacklist.addEventListener("click", () => 
  htmlBlacklistToggle(htmlSearchTerms.value, htmlBlacklist.value)
);

// Listener for keywords checkbox
htmlShowKeywords.addEventListener("click", () => 
  htmlKeywordToggle(htmlSearchTerms.value, htmlBlacklist.value)
);


// Tests various parts of the website functionality
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

}