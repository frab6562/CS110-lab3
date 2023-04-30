var searchString = '';
var time;
const url = 'http://50.21.190.71/get_tweets';
var holdAllTweets = [];

$(document).ready(function() 
{
    document.getElementById('feedRefresh').value='1';
    document.getElementById('feedRefresh').checked=false;
    document.getElementById('search-box').value='';
    // add line here to clear tweets array

    autoRefresh();
    function autoRefresh() 
    {
        // if not checked, call fetch every X seconds
        if(!(document.getElementById('feedRefresh').checked)) 
        {
            console.log('Inside document ready jquery, starting search');
            time = setInterval(function() 
            {
                getRequest();
            }, 5000);
        }
        else // if checked, want it to pause, clear interval
        {
            console.log('Inside document ready jquery, pausing search');
            clearInterval(time);
        }
    }
})

$(document).on('keyup', function (event) 
{
    if(event.key === 'Enter' || event.keyCode === 13) 
    {
        searchString = document.getElementById('search-box').value;
        console.log(searchString);
        document.getElementById('search-box').value = '';
        // this is where stored tweets should be filtered
        if (searchString == 'asd')
        {
            const sortedTweets = holdAllTweets.sort((a, b) => a.user_name.toLowerCase().localeCompare(b.user_name.toLowerCase()));
            console.log(holdAllTweets);
        }
    }
});

$(document).on('change', '#feedRefresh', function() 
{
    if($('#feedRefresh').is(':checked')) 
    {
        alert('Pausing tweet refreshing');
        console.log('Inside document change button, pausing search');
        clearInterval(time);
    }
    else
    {
        alert('Resuming tweet refreshing');
        console.log('Inside document change button, resuming search');
        time = setInterval(function() 
        {
            getRequest();
        }, 5000);
    }
});

function getRequest()
{
    fetch(url).then(res => res.json()).then(data => 
    {
        //console.log(data);
        for (var cnt = 0; cnt < data.length; cnt++)
        {
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
            }
            else
            {
                console.log('Not pushing ' + data[cnt] + ', it already exists')
            }
        }
        const tweetContainer = document.getElementById('tweet-container');
        refreshTweets(data);
        // Removes all existing tweets from tweetList and then append all tweets back in
        function refreshTweets(tweets) // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back 
        { // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
            while (tweetContainer.firstChild) 
            {
                tweetContainer.removeChild(tweetContainer.firstChild);
            }

            const tweetList = document.createElement("div"); // create an unordered list to hold the tweets https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
            tweetContainer.appendChild(tweetList); // append the tweetList to the tweetContainer https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild

            // all tweet objects (no duplicates) stored in tweets variable
            const filteredResult = tweets; // temporary because idk how to make the filter work
            //const filteredResult = tweets.filter(searchString); // filter on search text https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
            const sortedResult = filteredResult.sort((a, b) => b.date < a.date ? -1 : b.date > a.date ? 1 : 0 ); // sort by date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort and https://stackoverflow.com/a/72203024
            sortedResult.forEach(tweetObject => // execute the arrow function for each tweet https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
            {
                const tweet = document.createElement("div"); // create a container for individual tweet
                tweet.setAttribute('id', 'tweet');
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
                const usertag = document.createElement("div");
                usertag.setAttribute('class', 'tweet-usertag');
                const tag = document.createElement("p");
                tag.setAttribute('style', 'font-weight: bold;');
                tag.appendChild(document.createTextNode(tweetObject.user_name));
                const atsymbol = document.createElement("span");
                atsymbol.setAttribute('style', 'color: gray; font-weight: normal;');
                var atsymbolusertag = tweetObject.user_name.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
                atsymbolusertag = atsymbolusertag.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g,'');
                var postDate = tweetObject.date;
                postDate = postDate.split('-');
                const year = postDate[0];
                const month = postDate[1];
                var tempPostDate = postDate[2];
                tempPostDate = tempPostDate.split(' ');
                const dayNumber = tempPostDate[0];
                var monthsArray = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                const monthNumber = parseInt(month);
                const monthName = monthsArray[monthNumber - 1];
                postDate = monthName + ' ' + dayNumber + ' ' + year;
                atsymbolusertag = ' @' + atsymbolusertag.replace(/\s/g, '') + ' ' + postDate;
                atsymbol.appendChild(document.createTextNode(atsymbolusertag));
                tag.appendChild(atsymbol);
                usertag.appendChild(tag);
                const tweetContent = document.createElement("div"); // e.g. create a div holding tweet content
                const tweetText = document.createTextNode(tweetObject.text); // create a text node "safely" with HTML characters escaped https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode
                const paragraph = document.createElement("p");
                paragraph.appendChild(tweetText);
                tweetContent.appendChild(paragraph);
                usertag.appendChild(tweetContent);
                tweet.appendChild(usertag);
                tweetList.appendChild(tweet); // finally append your tweet into the tweet list
            });
        }
        // do something with data
        // remove dupes
        // set center div to be tweets
        // when search is activated, search all tweets for matching values, set current tweets to be ones that match search value
        //removeDuplicates(data)
        //appendTweet(data)
    })
    .catch(err => 
    {
        console.log(err);
    })
}

function removeDuplicates(duplicatesDataArr)
{
    // for all new tweets
    // check array of all previous tweets for dupes
    // remove dupes
    // if not dupe, add to list of previous tweets
}

function searchArray(dataArr, value) 
{
    // go through tweet, check if there is matching value in tweet
    // return array of matching tweets
}