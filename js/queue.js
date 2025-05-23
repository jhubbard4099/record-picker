// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to queue management
// Note: relies on QUEUE_DEBUG variable from the main javascript.js file

var currentQueue = [];


// Adds the record at the current row to the queue
// Currently, adds record to a local queue
// Parameters: row - table row representing a record to add
// TODO: Update once proper queue handling is implemented
function queueAdd(row)
{
  if(QUEUE_DEBUG) console.log(row);

  // Update queue button with record location (for now)
  updateQueueButton(row);

  // Subtract 2 to ignore header rows
  const recordIndex = row.rowIndex - 2;

  // Fetch record from selected row
  const recordToAdd = lastCollection[recordIndex];

  if (QUEUE_DEBUG) console.log(`Adding: ${recordToRemove}`);

  // Add record to queue
  if(!currentQueue.includes(recordToAdd))
  {
    currentQueue.push(recordToAdd);
  }
}

// Removes the record from the input row from the queue
// Currently, removes the record from a local queue
// Parameters: row - table row representing a record to remove
function queueRemove(row)
{
  if(QUEUE_DEBUG) console.log(row);

  // Read state of the "Show Keywords" checkbox
  const inputShowKeywords = document.getElementById("htmlShowKeywords").checked;

  // Subtract 2 to ignore header rows
  const recordIndex = row.rowIndex - 2;

  // Fetch record from selected row
  const recordToRemove = lastCollection[recordIndex];

  if (QUEUE_DEBUG) console.log(`Removing: ${recordToRemove}`);

  currentQueue.splice(recordIndex, 1);
  readCollection(currentQueue, inputShowKeywords);
}

// Updates the queue button of the input row to show location
// Parameters: row - table row containing a button to update
//
// Note: Assumes the following row format(s):
//    Artist - Album - Button
//    Artist - Album - Keywords - Button
function updateQueueButton(row)
{
  // Convert row json into cell array
  const cells = row.cells;

  // Fetch button depending on number of table columns
  var button = undefined;
  if(cells.length === 3)
  {
    button = cells[2].getElementsByTagName('button')[0];
  }
  else // cells.length === 4
  {
    button = cells[3].getElementsByTagName('button')[0];
  }

  // Button classes: location RecordType queueButton
  const buttonClasses = stringToArray(button.className, " ");
  const location = buttonClasses[0];

  button.textContent = location;
}

// Clears the queue of all records
function clearQueue()
{
  currentQueue = [];
}
