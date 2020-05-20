class Pluh {
    // this.backendUrl = 'https://us-central1-light-news.cloudfunctions.net/app/';


}

var ssPreloader = () => {
    return new Promise((resolve, reject) => {
        $(window).on('load', () => {

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", () => {

                // will fade out the whole DIV that covers the website.
                resolve($("#preloader").delay(300).fadeOut("slow"))

            });
        });
    })
};


retorna = ssPreloader()

// .then(()=>{
//     var typed4 = new Typed('#inputChat', {
//         strings: [' In a universe of dots the public is private.', 'Mutual excludable.', '/your_secret_Chat!'],
//         typeSpeed: 40,
//         backSpeed: 0,
//         attr: 'placeholder',
//         bindInputFocusEvents: true,
//         loop: false
//     });
// })

var typed = () => {
    new Typed('#inputChat', {
        strings: ['', 'The public is private.', 'Your key is your brain.', 'Mutual excludable.', '/your_secret_Chat!'],
        typeSpeed: 30,
        backSpeed: 0,
        attr: 'placeholder',
        bindInputFocusEvents: true,
        onComplete: () => { setTimeout(typed, 5000) }
    })
}

typed();





if (window.location.port === 5000) {
    rootUrl = 'http://localhost:5001/';
    $('#somethingToRise').val('https://www.bbc.com/portuguese/internacional-52485030')
}

let requisiting = false;
let endNews = false;

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