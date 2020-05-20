class Pluh{
    // this.backendUrl = 'https://us-central1-light-news.cloudfunctions.net/app/';

    
}


if (window.location.port === 5000) {
    rootUrl = 'http://localhost:5001/';
    $('#somethingToRise').val('https://www.bbc.com/portuguese/internacional-52485030')
}

let requisiting = false;
let endNews = false;

initNews()

async function initNews() {
    counterArticles = 0;
    pageCursor = "";
    animateDashboard("news/model.html")
    lightOut();
    while (counterArticles < 10) {
        await getNews();
    }
}

async function getNews() {
    try {
        if (!requisiting && !endNews) {
            requisiting = true;
            let news = await getFromCloud('robotNews', 'GET', { pageCursor, nNews })
            if (news[1].moreResults == "NO_MORE_RESULTS") {
                endNews = true;
            }
            postingNews(news)
            nNews = nNews + nOldNews;
            nOldNews = nNews - nOldNews;
            requisiting = false
        }
    } catch (error) {
        plotConsole(error)
        requisiting = false
    }
}

async function cloudComputing(someURl) {
    plotConsole(`Getting from: ${someURl}`)
    try {
        let postNews = await getFromCloud('robotNews', 'POST', { 'someURL': someURl, 'lang': 'pt' })
        plotConsole(postNews);
        initNews();
    } catch (error) {
        plotConsole(error)
    }
}

async function getFromCloud(func, method, dataIn) {
    let dataReturn;
    await $.ajax({
        'url': `${rootUrl}${func}`,
        'dataType': "json",
        'method': method,
        'crossDomain': true,
        'headers': {
            'Accept': 'application/json'
        },
        'data': dataIn,
        success: (data) => {
            dataReturn = data;
        },
        error: (request, status, error) => {
            plotConsole(status);
            plotConsole(error);
            plotConsole(request.responseText);
        }
    });
    return dataReturn;
}