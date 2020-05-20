class Pluh {
    constructor() {
        this.backendUrl = 'https://us-central1-light-news.cloudfunctions.net/app/';

        this.registerHandlers();
    }

    registerHandlers() {
        preLoader().then(() => alert())
    }

    preLoader() {
        return new Promise((resolve, reject) => {
            $(window).on('load', () => {
                $("#loader").fadeOut("slow", () => {
                    resolve($("#preloader").delay(300).fadeOut("slow"))
                });
            });
        })
    }
}

new Pluh


ssPreloader()

$("#openChat").click(() => {
    let animation = "2s cubic-bezier(0.4, 0, 1, 1) 0.3s 1 normal backwards running goesChat"
    $("#openChat").css('-moz-animation', animation)
        .css('animation', animation)
        .css('-webkit-animation', animation);
    setTimeout(() => $("#findChat").hide(), 2300);
    $("#windowChat").css('display', 'inline-block')
})


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