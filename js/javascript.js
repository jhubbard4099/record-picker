// Website for browsing & selecting from my vinyl record collection
// This file handles all direct interaction with the front end
//
// Breakdown of helper files:
//    record.js - all functions specific to the Record objects
//    collection.js - all functions specific to the collection of Record objects

const DEBUG = true;
const TEST_URL = true;

// Wait to do anything until page is loaded
window.onload=function(){

  
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
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
async function htmlSearchCollection(inputSearch, inputBlacklist)
{
  var recordCollection = await buildCollection();

  // Read state of the "AND results" checkbox
  const inputIsAnd = document.getElementById("htmlIsAnd").checked;

  if (DEBUG) console.log(`TERMS: ${inputSearch} | BLACKLIST: ${inputBlacklist} | AND: ${inputIsAnd}`)

  // Ignore blacklist if it isn't shown
  if(!isBlacklistVisible())
  {
    inputBlacklist = "";
  }

  // Search record collection, read it, then return
  const searchedCollection = await searchCollection(recordCollection, inputSearch, inputBlacklist, inputIsAnd);
  readCollection(searchedCollection);
  return searchedCollection;
}

// Wrapper function to be called by the HTML
// to show a single random record on button press
// Parameters:  inputSearch: comma separated string of search terms
//              inputBlacklist: comma separated string of blacklist terms
async function htmlRandomRecord(inputSearch, inputBlacklist)
{
  var randomNum = 0;
  var randomRecord = [];

  if (DEBUG) console.log(`RNGTERMS: ${inputSearch} | RNGBLACKLIST: ${inputBlacklist}`)

  // Determine if the random button should follow search terms
  if(inputSearch !== "" || inputBlacklist !== "")
  {
    if (DEBUG) console.log("Random with Search")

    const searchedCollection = await htmlSearchCollection(inputSearch, inputBlacklist);

    // Only pick a record if there is one to be picked
    if( searchedCollection !== undefined && searchedCollection.length > 0 )
    {
      randomNum = Math.floor(Math.random() * searchedCollection.length);
      randomRecord = [searchedCollection[randomNum]];
    }
  }
  else
  {
    if (DEBUG) console.log("Random without Search")
    
    // Pick a record from the full collection
    var recordCollection = await buildCollection();
    randomNum = Math.floor(Math.random() * recordCollection.length);
    randomRecord = [recordCollection[randomNum]];
  }

  if (DEBUG) console.log(`RNG: ${randomNum}`)

  readCollection(randomRecord);
}

// Determines if the blacklist bar is currently displayed
// Returns: true if visible, false otherwise
function isBlacklistVisible()
{
  if (DEBUG) console.log(`Blacklist Visibility: ${document.getElementById("htmlBlacklist").style.visibility}`)
  return document.getElementById("htmlBlacklist").style.visibility === "visible";
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
  htmlSearchCollection(inputSearch, inputBlacklist)
}

// HTML wrapped function to clear all fields
function htmlClearAll()
{
  document.getElementById("htmlSearchTerms").value = "";
  document.getElementById("htmlBlacklist").value = "";
  document.getElementById("htmlBlacklist").style.visibility = "hidden";
  document.getElementById("htmlIsAnd").checked = false;
  document.getElementById("htmlIsBlacklist").checked = false;
  htmlSearchCollection("", "");
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
const queueButton = document.getElementById("queueButton")

const htmlSearchTerms = document.getElementById("htmlSearchTerms")
const htmlBlacklist = document.getElementById("htmlBlacklist")

const htmlIsAnd = document.getElementById("htmlIsAnd")
const htmlIsBlacklist = document.getElementById("htmlIsBlacklist")


// Browse button functionality
browseButton.addEventListener("click", () => 
  htmlReadCollection()
);

// Search button functionality
searchButton.addEventListener("click", () => 
  htmlSearchCollection(htmlSearchTerms.value, htmlBlacklist.value)
);

// Random button functionality
randomButton.addEventListener("click", () => 
  htmlRandomRecord(htmlSearchTerms.value, htmlBlacklist.value)
);

// Clear button functionality
clearButton.addEventListener("click", () => 
  htmlClearAll()
);

// Queue button functionality
queueButton.addEventListener("click", () => 
  htmlDisplayQueue()
);

// Listener for typing in the search bar
htmlSearchTerms.addEventListener("keyup", (e) => 
  htmlSearchCollection(e.target.value, htmlBlacklist.value)
);

// Listener for typing in the blacklist bar
htmlBlacklist.addEventListener("keyup", (e) => 
  htmlSearchCollection(htmlSearchTerms.value, e.target.value)
);

// Listener for AND checkbox
htmlIsAnd.addEventListener("click", () => 
  htmlSearchCollection(htmlSearchTerms.value, htmlBlacklist.value)
);

// Listener for blacklist checkbox
htmlIsBlacklist.addEventListener("click", () => 
  htmlBlacklistToggle(htmlSearchTerms.value, htmlBlacklist.value)
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