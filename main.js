var searchString = '';
var time;
var isChecked;
const url = 'http://50.21.190.71/get_tweets';

$(document).ready(function() {
    
    // reset changes from previous usage
    // previous tweets
    // checkbox
    // if there's still text in search bar

    autoRefresh();
    function autoRefresh() 
    {
        // get status of checkbox
        
        // if not checked, call fetch every X seconds
        if (!isChecked)
        {
            time = setInterval(function() 
            {
                getRequest();
            }, 10000);
        }
        else if (isChecked)
        {
            // if checked, want it to pause, clear interval
            clearInterval(time);
        }
    }

    function removeDuplicates(duplicatesDataArr)
    {
        // for all new tweets
        // check array of all previous tweets for dupes
        // remove dupes
        // if not dupe, add to list of previous tweets
    }

    function searchArray(dataArr, value) {
        // go through tweet, check if there is matching value in tweet
        // return array of matching tweets
    }

    function appendTweet(dataArrUnSort) {
        // get content center element; want to add elements to this
        // empty current tweets
        // sort array of tweets chronologically
        // for each tweet
            // create div that can append to content-center
            // include pfp
                // check if image exists
                // var http = new XMLHttpRequest();
                // http.open("HEAD", imgURL);
                // http.send();
                // if (http.status != 404)
                // {
                //     //add image to tweet that is being created
                // }
        // create all additional pieces of info
            // like formatted date, tweet contents, username
    }
})

$(document).on('keyup', function (event) 
{
    if (event.key === 'Enter' || event.keyCode === 13) 
    {
        searchString = document.getElementById('search-box').value;
        document.getElementById('search-box').value = '';
    }
});

$(document).on('change', '#feedRefresh', function() 
{
    if($('#feedRefresh').is(':checked')) 
    {
        alert('Pausing tweet refreshing');
        clearInterval(time);
    }
    else
    {
        alert('Resuming tweet refreshing');
        time = setInterval(function() 
        {
            getRequest();
        }, 10000);
    }
});

function getRequest()
{
    fetch(url).then(res => res.json()).then(data => 
    {
        console.log(data);
        const tweetContainer = document.getElementById('tweet-container');
        refreshTweets(data);
        /**
         * Removes all existing tweets from tweetList and then append all tweets back in
         *
         * @param {Array<Object>} tweets - A list of tweets
         * @returns None, the tweets will be renewed
         */
        function refreshTweets(tweets) {
            // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
            // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
            while (tweetContainer.firstChild) {
                tweetContainer.removeChild(tweetContainer.firstChild);
            }

            const tweetList = document.createElement("ul"); // create an unordered list to hold the tweets https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
            tweetContainer.appendChild(tweetList); // append the tweetList to the tweetContainer https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild

            // all tweet objects (no duplicates) stored in tweets variable
            const filteredResult = tweets;
            //const filteredResult = tweets.filter(searchString); // filter on search text https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
            const sortedResult = filteredResult.sort(function(a, b) { return Date.parse(b) - Date.parse(a); }); // sort by date https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort and https://stackoverflow.com/a/69754377

            // execute the arrow function for each tweet
            // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
            sortedResult.forEach(tweetObject => 
            {
                const tweet = document.createElement("li"); // create a container for individual tweet
                const tweetContent = document.createElement("div"); // e.g. create a div holding tweet content
                const tweetText = document.createTextNode(tweetObject.text); // create a text node "safely" with HTML characters escaped https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode
                tweetContent.appendChild(tweetText); // append the text node to the div
                tweet.appendChild(tweetContent); // you may want to put more stuff here like time, username...
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