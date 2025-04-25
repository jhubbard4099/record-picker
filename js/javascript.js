// Website for browsing & selecting from my vinyl record collection
// This file handles all direct interaction with the front end
//
// Breakdown of helper files:
//    record.js - all functions specific to the Record objects
//    collection.js - all functions specific to the collection of Record objects

const DEBUG = false;
const TEST_URL = false;

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

  if(!isBlacklistVisible())
  {
    inputBlacklist = "";
  }

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

    if( searchedCollection !== undefined )
    {
      randomNum = Math.floor(Math.random() * searchedCollection.length);
      randomRecord = [searchedCollection[randomNum]];
    }
  }
  else
  {
    if (DEBUG) console.log("Random without Search")
    
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

// TODO
function htmlDisplayQueue()
{
  window.alert("Our dev gnomes are working very hard on this button right now!");
}

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

// Element declarations
const browseButton = document.getElementById("browseButton")
const randomButton = document.getElementById("randomButton")
const queueButton = document.getElementById("queueButton")
const htmlSearchTerms = document.getElementById("htmlSearchTerms")
const htmlIsAnd = document.getElementById("htmlIsAnd")
const htmlBlacklist = document.getElementById("htmlBlacklist")
const htmlIsBlacklist = document.getElementById("htmlIsBlacklist")

// Browse button functionality
browseButton.addEventListener("click", htmlReadCollection);

// Random button functionality
randomButton.addEventListener("click", (e) => {
  // get value of input field first
  htmlRandomRecord(htmlSearchTerms.value, htmlBlacklist.value);
});

// Queue button functionality
queueButton.addEventListener("click", htmlDisplayQueue);

// Listener for typing in the search bar
htmlSearchTerms.addEventListener("keyup", (e) => htmlSearchCollection(e.target.value, htmlBlacklist.value));

// Listener for typing in the blacklist bar
htmlBlacklist.addEventListener("keyup", (e) => htmlSearchCollection(htmlSearchTerms.value, e.target.value));

// Listener for AND checkbox
htmlIsAnd.addEventListener("click", (e) => {
  // get value of input field first
  htmlSearchCollection(htmlSearchTerms.value, htmlBlacklist.value);
});

// Listener for blacklist checkbox
htmlIsBlacklist.addEventListener("click", (e) => {
  // get value of input field first
  htmlBlacklistToggle(htmlSearchTerms.value, htmlBlacklist.value);
});

}