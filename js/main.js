var apiUrl = 'https://gateway.marvel.com:443/v1/public/characters';
var apiKey = 'e5ab43fc7896ce401e0ef924630e5537';
var limit = 100;
var offset = 0;
var data = 'limit='+limit+'&offset='+offset+'&apikey='+apiKey;
var responseje;

// RANGES
var rangeNR = 'limit=1&offset=0';
var rangeA = 'limit=79&offset=1';
var rangeB = 'limit=92&offset=80';
var rangeC = 'limit=100&offset=172';
var rangeC2 = 'limit=4&offset=268';
var rangeD = 'limit=78&offset=272';
var rangeE = 'limit=33&offset=350';
var rangeF = 'limit=37&offset=383';
var rangeG = 'limit=56&offset=420';
var rangeH = 'limit=70&offset=476';
var rangeI = 'limit=38&offset=546';
var rangeJ = 'limit=44&offset=584';
var rangeK = 'limit=34&offset=628';
var rangeL = 'limit=54&offset=662';
var rangeM = 'limit=100&offset=716';
var rangeM2 = 'limit=52&offset=816';
var rangeN = 'limit=44&offset=869';
var rangeO = 'limit=20&offset=913';
var rangeP = 'limit=62&offset=933';
var rangeQ = 'limit=9&offset=995';
var rangeR = 'limit=59&offset=1004';
var rangeS = 'limit=100&offset=1063';
var rangeS2 = 'limit=96&offset=1163';
var rangeT = 'limit=93&offset=1259';
var rangeU = 'limit=21&offset=1352';
var rangeV = 'limit=32&offset=1373';
var rangeW = 'limit=57&offset=1405';
var rangeX = 'limit=15&offset=1462';
var rangeY = 'limit=4&offset=1477';
var rangeZ = 'limit=10&offset=1481';

// POPUP ELEMENTS
var name;
var description;
var imageSrc;
var marvelLinks;
var events;
var stories;

// POPUP IDS
var overlay;
var popup;
var popupName;
var popupDescription;
var popupImage;
var popUpEventLink;
var charLink;

var HttpClient = function()
{
  this.get = function(aUrl, aCallback)
  {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function()
    { 
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
      {
        aCallback(anHttpRequest.responseText);
      }
    }
    anHttpRequest.open( "GET", aUrl, true );            
    anHttpRequest.send( null );
  }
}
function getCharacters(range)
{
  var table = document.getElementById("table");
  for (var i = table.rows.length - 1; i > -1; i--)
  {
    table.deleteRow(i);
  }
  var client = new HttpClient();
  client.get(apiUrl+"?"+range+"&apikey="+apiKey, function(response)
  {
    responseje = JSON.parse(response);
    for (var i = 0; i < responseje.data.results.length; i++)
    {
        var row = table.insertRow(-1);
        var charId = responseje.data.results[i].id;
        var cell1 = row.insertCell(0);
        cell1.innerHTML = '<div class="name" id="'+charId+'" onclick="getCharInfo('+charId+')">'+responseje.data.results[i].name+'</div>';
    }
  });
}

function getCharInfo(id)
{
  overlay = document.getElementById('overlay');
  popup = document.getElementById('popup');
  popupName = document.getElementById('charName');
  popupDescription = document.getElementById('charDescription');
  popupImage = document.getElementById('charImage');
  charLink = document.getElementById('charLink');
  overlay.style.display = "flex"; 
  client = new HttpClient();
  client.get(apiUrl+"/"+id+"?apikey="+apiKey, function(response)
  {
    responseje = JSON.parse(response);
    responseje = responseje.data.results[0];
    name = responseje.name;
    description = responseje.description;
    if(description === "")
    {
      description = "No description available";
    }
    imageSrc = responseje.thumbnail.path+"."+responseje.thumbnail.extension;

    getCharEvents(id);

    marvelLinks = responseje.urls[0];
    stories = responseje.stories.collectionURI;
    
    popupName.innerHTML = name;
    popupDescription.innerHTML = description;
    popupImage.src = imageSrc;
    charLink.href = marvelLinks.url;
  });
}

function getCharEvents(id)
{
  client.get(apiUrl+"/"+id+"/events?apikey="+apiKey, function(response)
  {
    responseje = JSON.parse(response);
    responseje = responseje.data.results;
    //  events = responseje.events.items;
    var ul = document.getElementById("evenList");
    var li = document.createElement("li");

    if (responseje.length > 0)
    {
      document.getElementById('charEvents').innerHTML = "Events";
      for (var i = 0; i < responseje.length; i++)
      {
          var a = document.createElement("a");
          var ulist = document.getElementById("evenList");
          var newItem = document.createElement("li");
          a.textContent = responseje[i].title;
          a.setAttribute('href', responseje[i].urls[0].url);
          a.setAttribute('target', '_blank');
          newItem.appendChild(a);
          ulist.appendChild(newItem);
      }
    }
    else
    {
      document.getElementById('charEvents').innerHTML = "No events found";
    }
  });


}

function closePopup()
{
  popupName.innerHTML = "";
  popupDescription.innerHTML = "";
  popupImage.src = "";
  overlay.style.display = "none";
  document.getElementById('charEvents').innerHTML = "Events";
  document.getElementById("evenList").innerHTML = "";
}