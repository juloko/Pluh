class Pluh {
    constructor() {
        //Variables
        this.backendUrl = this.verifyMode();
        this.userId = this.setUser();

        //DOM Objects:

        this.window = $(window);
        this.page = $('html');
        this.chat = $("#chat");
        this.wrapperChat = $("#wrapperChat");
        this.loader = $("#loader");
        this.preLoader = $("#preloader");
        this.findChat = $("#findChat");
        this.windowChat = $("#windowChat");
        this.inputChat = $("#inputChat");
        this.typeChat = $("#typeChat");
        this.btnOpenChat = $("#openChat");
        this.btnBack = $("#back");
        this.btnDelete = $("#delete");
        this.btnSendMsg = $("#sendMsg");

        //Functions
        this.init();
        this.registerHandlers();

        //Objects
        this.api = initApi()
    }

    async init() {
        await this.loading();
        this.typed('#inputChat',
            [
                '',
                'The public is private.',
                'Your key is your brain.',
                'Mutual excludable.',
                '/your_secret_Chat!'
            ]
        )
    }

    registerHandlers() {
        this.inputChat.keypress(e => this.openChat(e));
        this.typeChat.keypress(e => this.takeMsg(e));
        this.btnOpenChat.click(e => this.openChat(e));
        this.btnBack.click(() => this.back());
        this.btnDelete.click(() => this.delete());
        this.btnSendMsg.click(e => this.takeMsg(e));
        this.wrapperChat.bind('DOMSubtreeModified', () => this.updateScroll())
    }

    loading() {
        return new Promise((resolve, reject) => {
            this.window.on('load', () => {
                this.loader.fadeOut("slow", () => {
                    resolve(this.preLoader.delay(300).fadeOut("slow"))
                });
            });
        })
    }

    typed(place, strings) {
        new Typed(place, {
            strings,
            typeSpeed: 30,
            backSpeed: 0,
            attr: 'placeholder',
            bindInputFocusEvents: true,
            onComplete: () => { setTimeout(() => this.typed(place, strings), 5000) }
        })
    }

    verifyMode() {
        if (window.location.port === 5000) {
            return 'http://localhost:5001/';
        } else {
            return 'https://us-central1-light-news.cloudfunctions.net/app/';
        }
    }

    openChat(e) {
        if ((e.type == "click") || (e.type == "keypress" && e.which == 13)) {
            let animation = `2s cubic-bezier(0.4, 0, 1, 1) 0.3s 1 normal backwards running goesChat`
            this.setAnimation(this.btnOpenChat, animation)
            let timedAnimation = setInterval(() => {
                if (this.btnOpenChat.offset().left >= this.window.width()) {
                    clearInterval(timedAnimation)
                    this.findChat.hide()
                    this.setAnimation(this.btnOpenChat, '')
                    this.windowChat.css('display', 'inline-block')
                }
            }, 50);
        }
    }

    userData() {
        return {
            timeOpened: new Date(),
            timezone: (new Date()).getTimezoneOffset() / 60,
            pageon: window.location.pathname,
            referrer: document.referrer,
            previousSites: history.length,
            browserName: navigator.appName,
            browserEngine: navigator.product,
            browserVersion1a: navigator.appVersion,
            browserVersion1b: navigator.userAgent,
            browserLanguage: navigator.language,
            browserOnline: navigator.onLine,
            browserPlatform: navigator.platform,
            javaEnabled: navigator.javaEnabled(),
            dataCookiesEnabled: navigator.cookieEnabled,
            dataCookies1: document.cookie,
            dataCookies2: decodeURIComponent(document.cookie.split(";")),
            dataStorage: localStorage,
            sizeScreenW: screen.width,
            sizeScreenH: screen.height,
            sizeDocW: document.width,
            sizeDocH: document.height,
            sizeInW: innerWidth,
            sizeInH: innerHeight,
            sizeAvailW: screen.availWidth,
            sizeAvailH: screen.availHeight,
            scrColorDepth: screen.colorDepth,
            scrPixelDepth: screen.pixelDepth,
        };
    }

    hash(s) {
        let h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h;
    }

    setUser() {
        let foundUser = localStorage.getItem('userId');
        if (foundUser) {
            return foundUser;
        }
        else {
            let infoUser = this.userData();
            let stringInfo = JSON.stringify(infoUser)
            let userId = this.hash(stringInfo);
            localStorage.setItem('userId', userId)
            return userId;
        }
    }

    back() {
        this.windowChat.css('display', 'none')
        this.wrapperChat.html('');
        this.findChat.show()
    }

    delete() {
        this.wrapperChat.html('');
        this.page.html('');
        localStorage.clear();
        window.close();
    }

    takeMsg(e) {
        if ((e.type === "click") || (e.type === "keypress" && e.which === 13)) {
            if (this.typeChat.val().replace(/ /g, '').length) {
                let $message = $('<p></p>')
                    .addClass("messageA")
                    .html(this.typeChat.val())
                this.wrapperChat.append($message)
                this.typeChat.val('')
            }
        }
    }

    setAnimation(self, animation) {
        self.css('-moz-animation', animation)
            .css('animation', animation)
            .css('-webkit-animation', animation);
    }

    updateScroll() {
        let scrollNow = this.chat.scrollTop()
        let scrollMax = this.chat[0].scrollHeight - this.chat[0].offsetHeight
        let ratio = scrollNow / scrollMax
        if (ratio > .85) {
            this.chat.scrollTop(scrollMax)
        }
    }

    initApi() {
        return axios.create({
            baseURL: this.backendUrl,
            timeout: 500,
            dataType: 'json',
            crossDomain: true,
            headers: {
                Accept: 'application/json'
            },
        })
    }

    async sendMessage() {
        let response = await this.api.post('/robotNews', {
            someURl,
            'lang': 'pt'
        });
    }

    async  getMessages() {
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

}

new Pluh

