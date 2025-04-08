// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k

const sheetID = "1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ";
const sheetName = "Records";
const URL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

const testID = "13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k"
const testURL = `https://docs.google.com/spreadsheets/d/${testID}/gviz/tq?sheet=${sheetName}`;

fetch(testURL).then(response => response.text()).then(data => {
  console.log(data)

  const jsonBody = (data.split("setResponse(")[1]);
  const jsonText = jsonBody.slice(0, jsonBody.length - 2);
  const sheet = JSON.parse(jsonText);

  console.log(sheet);
  console.log(sheet.table.rows[0].c[0].v);
}).catch(error => console.log(error));

// album - string representing the album name
// artist - string representing the artist of the album
// keywords - array of strings including genre & other relevant info
function Record(album, artist, keywords)
{
  this.album = album;
  this.artist = artist;
  this.keywords = keywords;
}

var temp = new Record("Album", "Author", ["test1", "test2"]);
console.log(`Album: ${temp.album}\nAuthor: ${temp.artist}\nKeywords: ${temp.keywords}`);
