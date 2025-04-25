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

  // Determine if the random button should follow search terms
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