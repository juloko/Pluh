class Pluh {
    constructor() {
        //Contants
        this.animationLogin = `2s cubic-bezier(0.4, 0, 1, 1) 0.3s 1 normal backwards running goesChat`


        //Variables
        this.backendUrl = this.verifyMode();
        this.userId = this.setUser();
        this.chatId;
        this.pageCursos = ""
        this.endMsg = false;
        this.requisiting = false;


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
        this.api = this.initApi()
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
        this.typeChat.keypress(e => this.aMsg(e));
        this.btnOpenChat.click(e => this.openChat(e));
        this.btnBack.click(() => this.back());
        this.btnDelete.click(() => this.delete());
        this.btnSendMsg.click(e => this.aMsg(e));
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
        if (window.location.port == 5000) {
            return 'http://localhost:5001/pluhmessage/us-central1/app/';
        } else {
            return 'https://us-central1-pluhmessage.cloudfunctions.net/app';
        }
    }

    initChat() {
        this.setAnimation(this.btnOpenChat, this.animationLogin);
        let nameChat = this.inputChat.val();
        if (nameChat.replace(/ /g, '').length) {
            this.chatId = nameChat;

        } else {
            this.inputChat.val('').blur().focus();
        }
    }

    hideNameChatShowChat() {
        this.findChat.hide()
        this.inputChat.val('').blur().focus();
        this.setAnimation(this.btnOpenChat, '')
        this.windowChat.css('display', 'inline-block')
    }

    async initOldMessages() {
        await this.getMessage(5);
    }

    openChat(e) {
        if ((e.type == "click") || (e.type == "keypress" && e.which == 13)) {
            this.initChat();
            let timedAnimation = setInterval(() => {
                if (this.btnOpenChat.offset().left >= this.window.width()) {
                    clearInterval(timedAnimation);
                    this.hideNameChatShowChat();
                    this.initOldMessages();
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
        this.deleteMessage().then(() => {
            this.window.location = 'www.google.com';
        })
    }

    async aMsg(e) {
        if ((e.type === "click") || (e.type === "keypress" && e.which === 13)) {
            e.preventDefault()
            let textMsg = this.typeChat.val()
            if (textMsg.replace(/ /g, '').length) {
                this.plotMsg(textMsg, 'A')
                this.postMessage(textMsg).then(

                )
                    .catch(

                    )
            }
        }
    }

    plotMsg(msg, type) {
        let objMessage = $('<p></p>')
            .addClass("message" + type)
            .html(msg);
        this.wrapperChat.append(objMessage);
        this.typeChat.val('').blur().focus();
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
        })
    }

    async postMessage(msg) {
        return await this.api.post('/pluh', {
            "chatId": this.chatId,
            "userId": this.userId,
            msg
        });
    }

    async getMessage(nMsgs) {
        return await this.api.get('/pluh', {
            params: {
                "pageCursor": this.pageCursor,
                "chatId": this.chatId,
                nMsgs
            }
        });
    }

    async deleteMessage() {
        return await this.api.delete('/pluh', {
            "chatId": this.chatId,
        });
    }

    setRequisiting(status) {
        this.requisiting = status;
    }

    setEndMsg(status) {
        this.endMsg = status;
    }

    async  getMessages() {
        try {
            if (!this.requisiting && !this.endNews) {
                setRequisiting(true)
                let msgs = await this.api.post('/robotNews', {
                    someURl,
                    'lang': 'pt'
                });
                if (msgs[1].moreResults == "NO_MORE_RESULTS") {
                    setEndMsg(true)
                }
                putMsg(msgs)
                setRequisiting(false)
            }
        } catch (error) {
            setRequisiting(false)
        }
    }
}

new Pluh
