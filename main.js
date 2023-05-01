var searchString = '';
var time;
const url = 'http://50.21.190.71/get_tweets';
var holdAllTweets = [];
var currTweets = [];
var searchTweets = [];

/*

*/
$(document).ready(function()
{
    document.getElementById('feedRefresh').value='1';
    document.getElementById('feedRefresh').checked=false;
    document.getElementById('search-box').value='';
    holdAllTweets.length = 0;

    autoRefresh();
    function autoRefresh() 
    {
        // if not checked, call fetch every X seconds
        if(!(document.getElementById('feedRefresh').checked)) 
        {
            //console.log('Inside document ready jquery, starting search');
            time = setInterval(function() 
            {
                getRequest();
            }, 5000);
        }
        else // if checked, want it to pause, clear interval
        {
            //console.log('Inside document ready jquery, pausing search');
            clearInterval(time);
        }
    }
})

// Attempted Enter Button functionality but it was really buggy and always cleared screen.//
// $(document).on('keyup', function (event) 
// {
//     if(event.key === 'Enter' || event.keyCode === 13) 
//     {
//         for (var cnt = 0; cnt < holdAllTweets.length; cnt++)
//         {
//             if(holdAllTweets[cnt].text.includes(searchString))
//             {
//                 searchTweets.push(holdAllTweets[cnt]);
//             } 
//         }
//         currTweets = new Array();
//     }
// });

var oldSearchString;
//Every 5 seconds checks the search-box to see what has been typed and outputs the results of the search.
setInterval(function() 
{
    searchString = oldSearchString;
    searchString = document.getElementById('search-box').value;
    //if string is the same, append more tweets of same search to current feed of tweets
    if (searchString === oldSearchString)
    {
        for (var cnt = 0; cnt < currTweets.length; cnt++)
        {
            if(currTweets[cnt].text.includes(searchString))
            {
                searchTweets.push(currTweets[cnt]);
            } 
        }
        currTweets = new Array();
    }
    //If the string has changed, clear the feed and then keep running with a new search
    else if (searchString !== oldSearchString)
    {
            searchTweets.length = 0;
        for (var cnt = 0; cnt < currTweets.length; cnt++)
        {
            if(currTweets[cnt].text.includes(searchString))
            {
                searchTweets.push(currTweets[cnt]);
            } 
        }
        currTweets = new Array();
        oldSearchString = searchString;
    }
}, 5000);

$(document).on('change', '#feedRefresh', function() 
{
    if($('#feedRefresh').is(':checked')) 
    {
        alert('Pausing tweet refreshing');
        //console.log('Inside document change button, pausing search');
        clearInterval(time);
    }
    else
    {
        alert('Resuming tweet refreshing');
        //console.log('Inside document change button, resuming search');
        time = setInterval(function() 
        {
            getRequest();
        }, 5000);
    }
});

function getRequest()
{
    currTweets = new Array();
    fetch(url).then(res => res.json()).then(data => 
    {
        for (var cnt = 0; cnt < data.length; cnt++)
        {
            // this if-statement checks if the 10 new tweets exist in an array that holds all tweets
            // only pushes the new tweets to the array if they are unique tweets/non-duplicates (checks each tweet attribute)
            if (!(holdAllTweets.some(tweetItem => tweetItem.avatar === data[cnt].avatar &&
                tweetItem.date === data[cnt].date &&
                tweetItem.hashtags === data[cnt].hashtags &&
                tweetItem.is_retweet === data[cnt].is_retweet &&
                tweetItem.source === data[cnt].source &&
                tweetItem.text === data[cnt].text &&
                tweetItem.user_created === data[cnt].user_created &&
                tweetItem.user_description === data[cnt].user_description &&
                tweetItem.user_favourites === data[cnt].user_favourites &&
                tweetItem.user_followers === data[cnt].user_followers &&
                tweetItem.user_friends === data[cnt].user_friends &&
                tweetItem.user_location === data[cnt].user_location &&
                tweetItem.user_name === data[cnt].user_name &&
                tweetItem.user_verified === data[cnt].user_verified))) 
            {
                console.log('Pushing ' + data[cnt] + ' into holdAllTweets');
                holdAllTweets.push(data[cnt]);
                currTweets.push(data[cnt]);
            }
            else
            {
                console.log('Not pushing ' + data[cnt].text + ', it already exists')
            }
        }
        const tweetContainer = document.getElementById('tweet-container');
        refreshTweets(data);
        function refreshTweets(tweets)
        { 
            while (tweetContainer.firstChild) // Removes all existing tweets from tweetList and then append all tweets back in https://stackoverflow.com/questions/3955229/
            {
                tweetContainer.removeChild(tweetContainer.firstChild);
            }

            const tweetList = document.createElement("div"); // create a div to hold the tweets
            tweetContainer.appendChild(tweetList); // append the tweetList to the tweetContainer

            var sortedResult; 
            if(!searchString) // if searchString is empty, set sortedResult to the 10 new  tweets
            {
                sortedResult = tweets.sort((a, b) => b.date < a.date ? -1 : b.date > a.date ? 1 : 0 ); // sort by date https://stackoverflow.com/a/72203024
            }
            else // searchString is not empty, set sortedResult equal to the tweets returned by the search query
            {
                sortedResult = searchTweets.sort((a, b) => b.date < a.date ? -1 : b.date > a.date ? 1 : 0 ); // sort by date https://stackoverflow.com/a/72203024
            }
            sortedResult.forEach(tweetObject =>
            {
                // create a div for each tweet
                var tweet = document.createElement("div");
                tweet.setAttribute('id', 'tweet');
                
                // create an avatar for each tweet
                // checks if avatar URL is valid and sets img src to it if it is valid, otherwise uses Remy's default pfp
                const avatar = document.createElement("img");
                var imgURL = tweetObject.avatar;
                var http = new XMLHttpRequest();
                http.open("GET", imgURL, false);
                http.send();
                if (http.status != 404)
                {
                    avatar.setAttribute('src', imgURL);
                }
                else
                {
                    avatar.setAttribute('src', './images/ratatouille.jpg');
                }
                tweet.appendChild(avatar);
                
                // create a div that holds the user's tag, date, and tweet description
                const usertag = document.createElement("div");
                usertag.setAttribute('class', 'tweet-usertag');

                // creates a paragraph to hold the user's tag, sets style to be bold
                const tag = document.createElement("p");
                tag.setAttribute('style', 'font-weight: bold;');
                tag.appendChild(document.createTextNode(tweetObject.user_name));

                // creates a span that holds the @<username> and the tweet date
                const atsymbol = document.createElement("span");
                atsymbol.setAttribute('style', 'color: gray; font-weight: normal;');
                var atsymbolusertag = tweetObject.user_name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''); // https://stackoverflow.com/a/63464318, this removes emojis from the @<username>
                atsymbolusertag = atsymbolusertag.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g,''); // https://stackoverflow.com/a/16913929, this removes special characters from the @<username>

                // this gets the tweet's post date (YYYY-MM-DD HH:MM:SS) and splits it into components
                var postDate = tweetObject.date;
                postDate = postDate.split('-'); // this splits postDate into an array of  [YYYY, MM, DD HH:MM:SS]
                const year = postDate[0]; // this sets year to YYYY
                const month = postDate[1]; // this sets month to MM

                var tempPostDate = postDate[2]; // this sets tempPostDate to DD HH:MM:SS
                tempPostDate = tempPostDate.split(' '); // this splits tempPostDate into an array of [DD, HH:MM:SS]
                const dayNumber = tempPostDate[0]; // this sets dayNumber to DD

                // this converts the month number into its 3-character month name
                var monthsArray = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                const monthNumber = parseInt(month);
                const monthName = monthsArray[monthNumber - 1];

                // this appends the date into {MONTH} DD YYYY format
                postDate = monthName + ' ' + dayNumber + ' ' + year;

                atsymbolusertag = ' @' + atsymbolusertag.replace(/\s/g, '') + ' ' + postDate; // this removes whitespaces from the @<username>
                atsymbol.appendChild(document.createTextNode(atsymbolusertag)); // this appends the @<username> to the span above
                tag.appendChild(atsymbol); // this appends the span to the p above
                usertag.appendChild(tag); // this appends the p to the div that contains all the tweet elements above
                
                // this creates a div that holds p which holds the tweet text
                const tweetContent = document.createElement("div");
                const tweetText = document.createTextNode(tweetObject.text);

                // this creates a p that holds the tweet text
                const paragraph = document.createElement("p");
                paragraph.appendChild(tweetText); // this appends the text to p
                tweetContent.appendChild(paragraph); // this appends p to the div
                usertag.appendChild(tweetContent); // this appends the div that holds p to the div that contains all the tweet elements above
                tweet.appendChild(usertag); // this appends the div that contains all the tweet elements to the div that holds the tweet
                tweetList.appendChild(tweet); // finally append tweet into the tweet list
            });
        }
    })
    .catch(err => 
    {
        console.log(err);
    })
}