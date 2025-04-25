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

// Searches the current record for the input search terms
// Parameters:  record: record to search
//              searchArray: string array of search terms
//              isAnd: boolean for if the search terms should be AND'd
function searchRecord(record, searchArray, isAnd)
{
  // Iterate through list of search terms
  for(j = 0; j < searchArray.length; j++)
  {
    curSearch = searchArray[j];

    // Check if the current search term is present in any of the record fields
    if( record.album.toLowerCase().includes(curSearch) != false ||
        record.artist.toLowerCase().includes(curSearch) != false ||
        record.keywords.findIndex(element => element.includes(curSearch)) != -1)
    {
      // If normal case, we're done
      if(!isAnd)
      {
        if (DEBUG) console.warn("Match found!");
        return true;
      }
    }
    else
    {
      // If AND case, any miss means we're done
      return false;
    }
  }

  // If we made it this far in the AND case, then there were no misses
  if(isAnd)
  {
    if (DEBUG) console.warn("Match found!");
    return true;
  }

  return false;
}
