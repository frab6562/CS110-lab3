let searchString = '';
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
        console.log(document.getElementById('search-box').value);
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