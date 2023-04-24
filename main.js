$(document).ready(function() {
    const url = 'http://50.21.190.71/get_tweets';  
    // reset changes from previous usage
    // previous tweets
    // checkbox
    // if there's still text in search bar

    function autorefresh() {
        // get status of checkbox
        var isChecked = document.getElementById('feedRefresh').checked;
        // if not checked, call fetch every X seconds
        if (isChecked == false)
        {
            time = setInterval(function() {
                getRequest();
            }, 10000);
        }
        else if (isChecked == true)
        {
            // if checked, want it o pause, clear interval
            clearInterval(time);
        }
    }

    function getRequest()
    {
        fetch(url)
        .then(res => res.json()).then(data=> {
            // do something with data
            // remove dupes
            // set center div to be tweets
            // when search is activated, search all tweets for matching values, set current tweets to be ones that match search value
        })
        .catch(err=> {
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
                // var http = new XTMLHttpRequest();
                // http.open("HEAD", imgURL);
                // http.send();
                // if (http.status != 404)
                //{
                // add image to tweet that is being created
                //}
        // create all additional pieces of info
            // like formatted date, tweet contents, username
    }
})