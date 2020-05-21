const { Datastore } = require('@google-cloud/datastore');

const credentials = require('../database/credentials.json')

//Initialize client.
const datastore = new Datastore({
    projectId: credentials.gcpId,
});

module.exports = {
    async create(req, res, next) {
        //Get from user.
        const { chatId, userId, msg } = req.body || req.query;

        //Bundle information.
        let bundle = {
            chatId,
            userId,
            msg,
            'timestamp': new Date(),
        }

        try {
            const response = await datastore.save({
                key: datastore.key(['Chat', chatId]),
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
        const { pageCursor, chatId, nMsgs } = req.query || req.body
        try {
            let query = datastore.createQuery('Chat', chatId)
                .start(pageCursor)
                .order('timestamp', {
                    descending: true,
                })
                .limit(nMsgs)

            const response = await datastore.runQuery(query);
            res.send(response)
        } catch (err) {
            res.send(err)
        }
    },

    async delete(req, res, next) {
        const { chatId } = req.query || req.body
        const taskKey = datastore.key(['News', chatId]);
        try {
            const response = await datastore.delete(taskKey);
            res.send(response)

        } catch (err) {
            res.send(err)
        }
        res.send(response);
    },
}