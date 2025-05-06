// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to Record objects
// Note: relies on RECORD_DEBUG variable from the main javascript.js file


// Object representing a vinyl record
// Parameters:  album - string representing the album name
//              artist - string representing the artist of the album
//              keywords - array of strings including genre & other relevant info
//              type - string representing the type of record it is
class Record {
  constructor(album, artist, keywords, type) {
    this.album = album;
    this.artist = artist;
    this.keywords = keywords;
    this.type = type;
  }
}

// Create a record object from input spreadsheet row
// Parameters:  row: spreadsheet row to convert to a Record object
// Returns:     a new Record object
// Note: assumes the following row format:
//    Artist - Album - Owned - Genre - Media - Misc
function createRecord(row)
{
  // Fetch album and artist strings
  var curAlbum = row[0].v;
  var curArtist = row[1].v;

  // Fetch genre, media, and misc strings,
  // then split them into arrays
  // TODO: use trim()?
  var curGenre = row[3].v.split(", ");
  var curMedia = row[4].v.split(", ");
  var curMisc = row[5].v.split(", ");
  
  // Build keywords based on what sections aren't empty
  var curKeywords = curGenre;
  if(curMedia[0] !== " ")
  {
    curKeywords = curKeywords.concat(curMedia);
  } 
  if(curMisc[0] !== " ")
  {
    curKeywords = curKeywords.concat(curMisc);
  }

  // Find album record type
  var curType = findRecordType(curGenre, curMedia, curMisc);

  // Build and return a Record object
  return new Record(curAlbum, curArtist, curKeywords, curType);
}

// Convert record to a printable string, which is also sent to the console
// Parameters:  record: a Record object to convert to a string
// Returns:     a string representation of a record
function recordToString(record)
{
  var recordString = "";

  if(record !== undefined)
  {
    recordString = `Album: ${record.album}\nArtist: ${record.artist}\nKeywords: ${record.keywords}`;
  }

  if (RECORD_DEBUG) console.log(recordString);
  
  return recordString
}

// Used to colorize the collection table based on type of record
// Parameters:  genre: genre field of the record to determine
//              media: media field of the record to determine
//              misc: misc field of the record to determine
// Returns: HTML class used to pick row color
function findRecordType(genre, media, misc)
{
  var recordType = "";

  // Determine record type based on specific criteria
  if(media[0] === " " && !genre.includes("non-music") && !misc.includes("mystery"))
  {
    recordType = "TBLTraditional";
  }
  else if(misc.includes("soundtrack") && !media.includes("vgm"))
  {
    recordType = "TBLScore";
  }
  else if(misc.includes("cover"))
  {
    recordType = "TBLCover";
  }
  else if(misc.includes("soundtrack") && media.includes("vgm"))
  {
    recordType = "TBLVGM";
  }
  else
  {
    recordType = "TBLMisc";
  }

  if (RECORD_DEBUG) console.log(`Record Type: ${recordType}`);
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

  const searchQuery = searchTerm.split(":");
  if(searchQuery[0] === "type")
  {
    if (RECORD_DEBUG) console.log(`Advanced Search Mode - Query: ${searchQuery} | Type: ${record.type}`)
    return searchQuery[1] == record.type.toLowerCase();
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
    if (RECORD_DEBUG) console.error("Undefined record!");
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
        if (RECORD_DEBUG) console.warn("Match found!");
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
    if (RECORD_DEBUG) console.warn("Match found!");
    return true;
  }

  // Should never reach here
  return false;
}

// Determines if the input record has any blacklisted terms present
// Parameters:  record: record to search
//              blacklistArray: string array of blacklist terms
// Returns:     true if the record has any of the blacklisted terms, false otherwise
function isRecordOnBlacklist(record, blacklistArray)
{
  if(record === undefined)
  {
    if (RECORD_DEBUG) console.error("Undefined record!");
    return false;
  }

  // Iterate through the blacklist & stop if there's a positive hit
  for(var i = 0; i < blacklistArray.length; i++)
  {
    curSearch = blacklistArray[i];

    // Check if the current search term is present in any of the record fields
    if(doesRecordContain(record, curSearch))
    {
      if (RECORD_DEBUG) console.warn("Record is on blacklist");
      return true;
    }
  }

  if (RECORD_DEBUG) console.warn("Record is NOT on blacklist");
  return false;
}
