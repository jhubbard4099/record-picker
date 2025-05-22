
// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to UI interaction & HTML
// Note: relies on HTML_DEBUG variable from the main javascript.js file


// Wrapper function to be called by the HTML which increments
// the records rotation speed & applies various effects
// TODO: Smoother rotation increases
// TODO: Record Clicker - record scratch, needles, plays music,
//                        limited time per ascension, etc.
function htmlRecord()
{
  // TODO
  // var sound = new Audio("./sfx/record-scratch.wav");
  // sound.volume = 0.2;
  // sound.play();

  var fullRecord = document.getElementById("recordContainer");
  var recordBody = document.getElementById("record");
  var recordText = document.getElementById("recordText");
  
  // Field is blank by default, so fill with known starting value
  var spinDuration = fullRecord.style.animationDuration;
  if (spinDuration === "") spinDuration = "10000ms";

  // Split duration into a numeric and alphabetic parts
  var durationArray = spinDuration.match(/[a-zA-Z]+|[0-9]+/g);
  const curDuration = durationArray[0];

  // Determine how much to increase rotation speed
  if(curDuration > 5000)
  {
    durationArray[0] -= 1000;
  }
  else if(curDuration > 1000)
  {
    durationArray[0] -= 500;
  }
  else if(curDuration > 100)
  {
    durationArray[0] -= 100;
  }
  else if(curDuration > 10)
  {
    durationArray[0] -= 10;
  }
  else if(curDuration > 1)
  {
    durationArray[0] -= 1;
  }
  else // Max speed
  {
    durationArray[0] = curDuration;
  }

  // Switch to blured image when rotating fast
  if(durationArray[0] < 500 && recordBody.src.includes("/img/record.png"))
  {
    recordBody.src = "./img/record rotating.png";
    recordText.src = "./img/text rotating.png";
  }

  // Activate max spin mode when rotation speed is maxed out
  if(durationArray[0] == 1 && !fullRecord.classList.contains("maxSpin"))
  {
    fullRecord.classList.toggle("maxSpin");
  }

  // Re-combine into a duration string
  spinDuration = durationArray.join("");

  if (HTML_DEBUG) console.log(`Spin Duration: ${spinDuration}`);

  fullRecord.style.animationDuration = spinDuration;
}

// Wrapper function to be called by the HTML
// to display the collection on button press
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

  // Reset record effects
  var fullRecord = document.getElementById("recordContainer");
  fullRecord.style.animationDuration = "10000ms";
  document.getElementById("record").src = "./img/record.png";
  document.getElementById("recordText").src = "./img/text.png";

  if(fullRecord.classList.contains("maxSpin"))
  {
    fullRecord.classList.toggle("maxSpin");
  }
  
  // Clear record display
  clearCollection();
}

// TODO: - Add queue support
//       - Basic "login" system to allow people to pick a Username
//       - Queue control buttons only for me
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
const spinningRecord = document.getElementById("recordContainer");

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
spinningRecord.addEventListener("click", () => 
  htmlRecord()
);


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
