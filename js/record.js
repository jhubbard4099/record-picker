// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to Record objects
// Note: relies on DEBUG variable from the main javascript.js file

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

  if (DEBUG) console.log(recordString);
  
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

// Used to colorize the collection table based on type of record
// Returns: HTML class used to pick row color
// TODO: Update logic when genre/media/misc fields are all separate
function findRecordType(record)
{
  var recordType = "";

  if(record === undefined)
  {
    return "";
  }

  if(!record.keywords.includes("soundtrack") && !record.keywords.includes("cover") && !record.keywords.includes("mystery") && !record.keywords.includes("non-music"))
  {
    recordType = "TBLTraditional";
  }
  else if(record.keywords.includes("soundtrack") && !record.keywords.includes("vgm"))
  {
    recordType = "TBLScore";
  }
  else if(record.keywords.includes("cover"))
  {
    recordType = "TBLCover";
  }
  else if(record.keywords.includes("soundtrack") && record.keywords.includes("vgm"))
  {
    recordType = "TBLVGM";
  }
  else
  {
    recordType = "TBLMisc";
  }

  if (DEBUG) console.log(`Record Type: ${recordType}`)
  return recordType;
}

// Determines if a record contains an input search term
// Parameters:  record: record to search
//              searchTerm: string of a single search term
// Returns:     true if the record contains the given term, false otherwise
function doesRecordContain(record, searchTerm)
{
  if(record === undefined || searchTerm === "")
  {
    return false;
  }

  // Check each field of the Record object separately
  return record.album.toLowerCase().includes(searchTerm) != false ||
         record.artist.toLowerCase().includes(searchTerm) != false ||
         record.keywords.findIndex(element => element.includes(searchTerm)) != -1;
}

// Searches the current record for the input search terms
// Parameters:  record: record to search
//              searchArray: string array of search terms
//              isAnd: boolean for if the search terms should be AND'd
// Returns:     true if the record contains any searches if isAnd is false, OR
//              true if the record contains all searches if isAnd is true
//              false otherwise
function searchRecord(record, searchArray, isAnd)
{
  if(record === undefined)
  {
    if (DEBUG) console.error("Undefined record!");
    return false;
  }

  // Empty search array should default to true
  if(searchArray.length === 0)
  {
    return true;
  }

  // Iterate through list of search terms
  for(var i = 0; i < searchArray.length; i++)
  {
    curSearch = searchArray[i];

    // Check if the current search term is present in any of the record fields
    if(doesRecordContain(record, curSearch))
    {
      // If normal case, we're done
      if(!isAnd)
      {
        if (DEBUG) console.warn("Match found!");
        return true;
      }
    }
    else if(isAnd)
    {
      // If AND case, any miss means we're done
      return false;
    }
    else
    {
      // Do nothing
    }
  }

  // If we made it this far in the AND case, then there were no misses
  if(isAnd)
  {
    if (DEBUG) console.warn("Match found!");
    return true;
  }

  // Should never reach here
  return false;
}

// Determines if the input record has any blacklisted terms present
// Parameters:  record: record to search
//              searchArray: string array of search terms
// Returns:     true if the record has any of the blacklisted terms, false otherwise
function isRecordOnBlacklist(record, blacklistArray)
{
  if(record === undefined)
  {
    if (DEBUG) console.error("Undefined record!");
    return false;
  }

  // Iterate through the blacklist & stop if there's a positive hit
  for(var i = 0; i < blacklistArray.length; i++)
  {
    curSearch = blacklistArray[i];

    // Check if the current search term is present in any of the record fields
    if(doesRecordContain(record, curSearch))
    {
      if (DEBUG) console.warn("Record is on blacklist");
      return true;
    }
  }

  if (DEBUG) console.warn("Record is NOT on blacklist");
  return false;
}
