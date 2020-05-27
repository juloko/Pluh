const { Datastore } = require('@google-cloud/datastore');

const credentials = require('../database/credentials.json')

//Initialize client.
const datastore = new Datastore({
    projectId: credentials.gcpId,
});

module.exports = {
    async create(req, res, next) {
        //Get from user.
        const { chatId, userId, msg, timestamp = new Date() } = req.body;
        //Bundle information.
        let bundle = {
            userId,
            msg,
            timestamp,
        }

        try {
            const response = await datastore.save({
                key: datastore.key([chatId]),
                data: bundle,
                excludeFromIndexes: [
                    'msg'
                ]
            });
            res.send(response)
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async index(req, res, next) {
        const { pageCursor, chatId, nMsgs } = req.query;
        try {
            const [resp] = await datastore.get(datastore.key(['Delete', chatId]));
            let timestamp
            resp ? timestamp = resp.timestamp : timestamp = new Date('1990-01-01T00:00:00z')

            const query = datastore.createQuery(chatId)
                .start(pageCursor)
                .order('timestamp', {
                    descending: true,
                })
                .filter('timestamp', '>', timestamp)
                .limit(nMsgs)

            const response = await datastore.runQuery(query);
            res.header('Accept-Datetime', timestamp);
            res.send(response)
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async delete(req, res, next) {
        const { chatId } = req.query
        try {
            const response = await datastore.upsert([
                {
                    key: datastore.key(['Data', chatId]),
                    data: {
                        nUsers: 2,
                        users: [],
                        secret: false,
                    },
                },
                {
                    key: datastore.key(['Delete', chatId]),
                    data: {
                        'timestamp': new Date()
                    },
                },
            ]);

            res.send(response)
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async session(req, res, next) {
        const { userId, chatId } = req.body;

        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]))
            if (!resp) {
                const bundle = {
                    nUsers: 2,
                    users: [userId],
                    secret: false,
                }

                await datastore.save({
                    key: datastore.key(['Data', chatId]),
                    data: bundle,
                });

                return res.send(bundle)
            } else if (resp.users.includes(userId)) {

                return res.send(resp)
            }
            else if (resp.users.length < resp.nUsers) {
                const bundle = resp;
                bundle.users.push(userId)

                await datastore.save({
                    key: datastore.key(['Data', chatId]),
                    data: bundle,
                });

                return res.send(bundle)
            } else {
                res.status(400).send({
                    message: 'Forbidden Access to this chat! Thy create another one, or comeback to last device that you used to enter.!'
                })
            }
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },
}

