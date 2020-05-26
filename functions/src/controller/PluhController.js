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
            chatId,
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
            const response = await datastore.save({
                key: datastore.key(['Delete', chatId]),
                data: { 'timestamp': new Date() },
            });

            res.send(response)
        } catch (err) {
            console.error('ERROR:', err);
            res.send(err)
        }
    },

}