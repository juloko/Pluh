

class Pluh {
    constructor() {
        //Contants
        this.animationLogin = `10s cubic-bezier(0, -0.02, 0, 1.71) 0.3s 1 normal backwards running goesChat`
        this.animationShake = `2s   1 normal backwards running shake`

        //Variables
        this.backendUrl;
        this.userId = this.setUser();
        this.chatId;
        this.pageCursos = ""
        this.endMsg = false;
        this.requisiting = false;
        this.mobilecheck = this.mobileCheck()

        //DOM Objects:
        this.window = $(window);
        this.page = $('html');
        this.chat = $("#chat");
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
        this.sideA = $('.side-a')
        this.footer = $('footer')

        //Objects
        this.api;

        //InitFunctions
        this.init();
        this.registerHandlers();
    }

    async init() {
        await this.loading();
        await this.verifyMode()
        this.api = this.initApi()
        this.typed(this.inputChat.selector, [
            '',
            'The public is private.',
            'Your key is your brain.',
            'Mutual excludable.',
            '/your_secret_Chat!'
        ]);
    }

    registerHandlers() {
        this.inputChat.keypress(e => this.openChat(e));
        this.typeChat.keypress(e => this.aMsg(e));
        this.btnOpenChat.click(e => this.openChat(e));
        this.btnBack.click(() => this.back());
        this.btnDelete.click(() => this.delete());
        this.btnSendMsg.click(e => this.aMsg(e));
        this.chat.bind('DOMSubtreeModified', () => this.updateScroll());
        // this.window.resize(() => this.resize());

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
        return new Typed(place, {
            strings,
            typeSpeed: 30,
            backSpeed: 0,
            attr: 'placeholder',
            bindInputFocusEvents: true,
            onComplete: () => { setTimeout(() => this.typed(place, strings), 5000) }
        })
    }

    async verifyMode() {
        try {
            const response = await axios({
                method: 'PUT',
                url: `http://localhost:5001/pluhmessage/us-central1/app/pluh`,
            });
        } catch (err) {
            if (err.message == "Request failed with status code 404") {
                this.backendUrl = 'http://localhost:5001/pluhmessage/us-central1/app/';
            } else {
                this.backendUrl = 'https://us-central1-pluhmessage.cloudfunctions.net/app';
            }
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
        this.inputChat.val('').blur()
        this.windowChat.css('display', 'flex')
        if (this.mobilecheck || this.window.width() < 768) {
            this.sideA.hide()
            this.footer.hide()
        }
    }

    async initOldMessages(chatId) {
        this.chatId = chatId;
        const msgs = await this.getMessage(10);
        this.hideNameChatShowChat();
        if (msgs) {
            msgs.forEach((ele, ) => {
                this.plotReceivedMsg(ele.msg, ele.timestamp, 'A')
            })
            this.downScroll();
        }
    }

    verifyColision(obj, wall, callback) {
        let timedAnimation = setInterval(() => {
            if (obj.offset().left >= wall.width()) {
                clearInterval(timedAnimation);
                callback()
            }
        }, 50);
    }

    openChat(e) {
        if ((e.type == "click") || (e.type == "keypress" && e.which == 13)) {
            this.setAnimation(this.btnOpenChat, this.animationLogin);
            let chatId = this.inputChat.val();
            if (chatId.replace(/ /g, '').length) {
                this.initOldMessages(chatId);
            } else {
                this.setAnimation(this.btnOpenChat, '');
                this.setAnimation(this.inputChat, this.animationShake);
                this.inputChat.val('').blur();
            }
        }
    }

    showAt() { console.log('essa mrd', this.inputType); }

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
        this.windowChat.css('display', 'none');
        this.chat.html('');
        this.findChat.show();
        this.sideA.show();
        this.footer.show();
    }

    delete() {
        this.chat.html('');
        this.page.html('');
        localStorage.clear();
        this.deleteMessage().then(() => {
            this.window.location = 'www.google.com';
        })
    }

    async aMsg(e) {
        if ((e.type === "click") || (e.type === "keypress" && e.which === 13 && !e.shiftKey)) {
            e.preventDefault()
            let textMsg = this.typeChat.html()
            if (textMsg.replace(/ /g, '').length) {
                this.plotUserMsg(textMsg, 'A')
                this.postMessage(textMsg).then(() => {
                    $("#chat").find('p').last().find('i').removeClass("fas fa-hourglass-start").addClass("fas fa-hourglass-end");
                }

                )
            }
        }
    }

    structureMsg(msg, timestamp, type, icon) {
        let main = $('<p></p>')
            .addClass("message" + type)
            .html(msg)

        let time = $('<span></span>')
            .html(new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(' ', ''))

        let status = $('<i></i>')
            .addClass(icon)

        let sub = $('<span></span>')
            .addClass('timeMsg')
            .append(time)
            .append(status)

        return main.append(sub)
    }

    plotUserMsg(msg) {
        let objMessage = this.structureMsg(msg, Date.parse(new Date()), 'A', 'fas fa-hourglass-start')
        this.chat.append(objMessage)
        this.typeChat.html('').blur().focus();
    }

    plotReceivedMsg(msg, timestamp, type) {
        let objMessage = this.structureMsg(msg, timestamp, type, '')
        this.chat.html() ? this.chat.children().eq(0).before(objMessage) : this.chat.append(objMessage);
    }

    setAnimation(self, animation) {
        let time = animation.split('s')[0]
        if (time) {
            setTimeout(() => {
                this.setAnimation(self, '')
            }, time * 1000);
        }

        self.css('-moz-animation', animation)
            .css('animation', animation)
            .css('-webkit-animation', animation);
    }

    updateScroll() {
        let scrollNow = this.chat.scrollTop()
        let scrollMax = this.chat[0].scrollHeight - this.chat[0].offsetHeight
        let ratio = scrollNow / scrollMax
        if (ratio > .65) {
            this.chat.scrollTop(scrollMax)
        }
    }

    downScroll() {
        let scrollMax = this.chat[0].scrollHeight - this.chat[0].offsetHeight
        this.chat.scrollTop(scrollMax)
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

    mobileCheck() {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    async delay(seconds) {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000)
        })
    }

    async  getMessage(nMsgs) {
        try {
            if (!this.requisiting && !this.endMsg) {
                this.setRequisiting(true)
                let msgs = await this.api.get('/pluh', {
                    params: {
                        "pageCursor": this.pageCursor,
                        "chatId": this.chatId,
                        nMsgs
                    }
                })
                if (msgs.data[1]) {
                    if (msgs.data[1].moreResults == "NO_MORE_RESULTS") {
                        this.setEndMsg(true)
                    }
                    this.setRequisiting(false)
                    return msgs.data[0];
                } else if (msgs.data.code == 13) {
                    await this.delay(2);
                    return await this.getMessage(nMsgs);
                } else {
                    alert("Unknown error");
                }
            }
        } catch (error) {
            this.setRequisiting(false)
        }
    }
}

pl = new Pluh
