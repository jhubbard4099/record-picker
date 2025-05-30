// Website for browsing & selecting from my vinyl record collection
// This file contains various miscellaneous functions for website functionality
//
// Breakdown of helper files:
//    record.js - all functions specific to the Record objects
//    collection.js - all functions specific to the collection of Record objects
// TODO: Color themes
// TODO: Cleanup document.getElementById() usage


// --------------------- //
//  CONSTANTS & GLOBALS  //
// --------------------- //

// Testing constants
const TEST_URL = false;
const MAIN_DEBUG = false;
const HTML_DEBUG = false;
const COLLECTION_DEBUG = false;
const QUEUE_DEBUG = false;
const TABLE_DEBUG = false;
const RECORD_DEBUG = false;

// Global variables
var lastFunction = "CLEAR";
var rngSeed = -1;


// ------------------ //
//  HELPER FUNCTIONS  //
// ------------------ //

// Converts an input string to an array
// Parameters: inputString - string list of terms
//             delimiter - string to split the input by
// Returns:    an array of strings
function stringToArray(inputString, delimiter)
{
  // Return empty string if input is undefined or empty
  if(inputString === undefined || inputString === "")
  {
    if (COLLECTION_DEBUG) console.log("returning empty array");
    return [];
  }

  // Split and trim all whitespace from input string
  var outputArray = inputString.split(delimiter);
  for(var i = 0; i < outputArray.length; i++)
  {
    outputArray[i] = outputArray[i].trim().toLowerCase();
  }

  if (COLLECTION_DEBUG) console.log(`input: ${inputString} | output: ${outputArray}`);

  return outputArray;
}

// Determines if the blacklist bar is currently displayed
// Returns: true if visible, false otherwise
function isBlacklistVisible()
{
  if (MAIN_DEBUG) console.log(`Blacklist Visibility: ${document.getElementById("htmlBlacklist").style.visibility}`);
  return document.getElementById("htmlBlacklist").style.visibility === "visible";
}


// ------------------------ //
//  SEARCH FIELD FUNCTIONS  //
// ------------------------ //

// Removes all extraneous commas from input string
// Parameters: inputField - string to trim
// Returns:    trimmed string
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

// Clears current search of all advanced search terms based on input string
// Parameters: search - string of the advanced search to clear, format ${search}:
function clearAdvancedSearch(search)
{
  // Regex searches for arbitrary number of characters after the ":",
  // including up to a comma if one is found
  const regex = new RegExp(`${search}:.*?(?=,|$)`)
  var curSearch = document.getElementById("htmlSearchTerms").value;
  var itemsToRemove = curSearch.match(regex);

  // Loop through item removals until all searches are removed
  while(itemsToRemove !== null)
  {
    if (MAIN_DEBUG) console.log(curSearch);
    document.getElementById("htmlSearchTerms").value = curSearch.replace(itemsToRemove[0], "");
    
    curSearch = document.getElementById("htmlSearchTerms").value;
    itemsToRemove = curSearch.match(regex);
  }
}

// TODO
// function clearTableHover()
// {
// 
// }
// 
// function simulateTableHover(element)
// {
//   console.log(typeof(element));
//   element = element.replace("TBL", "key");
//   console.log(element);
//   document.getElementById(`${element}`).style.filter = "brightness(115%)";
// }


// ------------------- //
//  TESTING FUNCTIONS  //
// ------------------- //

// Tests various parts of the website functionality
async function test()
{
  var temp = new Record("A Very Mary Cliffmas", "Cliff King", ["christmas", "holiday", "parody"]);
  if (MAIN_DEBUG) recordToString(temp);

  const recordCollection = await buildCollection();
  //readCollection(recordCollection);

  //const searchTest = searchCollection(recordCollection, "metal, test,everhood, Helynt", false);
  const searchTest = searchCollection(recordCollection, "electronic, techno", true);

  readCollection(searchTest);
}
//test();
