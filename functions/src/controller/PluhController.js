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
        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]));

            if (!resp.users.includes( userId)) {
                throw res.status(403).send({
                    message: "Forbidden Access!"
                })
            } else {
                //Bundle information.
                let bundle = {
                    userId,
                    msg,
                    timestamp,
                }

                const response = await datastore.save({
                    key: datastore.key([chatId]),
                    data: bundle,
                    excludeFromIndexes: [
                        'msg'
                    ]
                });
                res.send(response)
            }
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async index(req, res, next) {
        const { pageCursor, chatId, nMsgs, userId } = req.query;

        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]))
            if (!resp.users.includes(userId)) {
                throw res.status(403).send({
                    message: "Forbidden Access!"
                })
            } else {
                let deleted
                resp.deleted ? deleted = resp.deleted : deleted = new Date('1990-01-01T00:00:00z')

                const query = datastore.createQuery(chatId)
                    .start(pageCursor)
                    .order('timestamp', {
                        descending: true,
                    })
                    .filter('timestamp', '>', deleted)
                    .limit(nMsgs)
                const response = await datastore.runQuery(query);
                res.send(response)
            }
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async delete(req, res, next) {
        const { chatId, userId } = req.query
        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]))

            if (!resp.users.includes(userId)) {
                throw res.status(403).send({
                    message: "Forbidden Access!"
                })
            }
            const response = await datastore.upsert([
                {
                    key: datastore.key(['Data', chatId]),
                    data: {
                        deleted: new Date(),
                        nUsers: 2,
                        users: [],
                        secret: false,
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
        const bundle = {
            nUsers: 2,
            users: [userId],
            secret: false,
        }
        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]))
            if (!resp) {
                await datastore.save({
                    key: datastore.key(['Data', chatId]),
                    data: bundle,
                });

                return res.send(bundle)
            } else if (resp.users) {
                if (resp.users.includes(userId)) {

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
                }
                else {
                    res.status(403).send({
                        message: 'Forbidden Access to this chat! Thy create another one, or comeback to last device that you used to enter.!'
                    })
                }
            } else {
                return res.send(bundle)
            }

        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

    async patch(req, res, next) {
        const { chatId, nUsers, userId, secret } = req.body
        try {
            const [resp] = await datastore.get(datastore.key(['Data', chatId]))
            if (resp.nUsers > nUsers) {
                throw res.status(403).send({
                    message: "Forbidden Access! You can't decrease the number of users."
                })
            } else if (!resp.users.includes(userId)) {
                throw res.status(403).send({
                    message: "Forbidden Access!"
                })
            }
            else {
                const response = await datastore.merge([
                    {
                        key: datastore.key(['Data', chatId]),
                        data: {
                            nUsers,
                            secret,
                        },
                    }
                ]);

                res.send(response)
            }
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },
}

