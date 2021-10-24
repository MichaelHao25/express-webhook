const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const child_process = require('child_process')
const path = require("path");
const exec = child_process.exec;


const verify_signature = (req) => {
    const hmac = crypto.createHmac('sha256', 'cHJmH4-h6gBSCcx')
    hmac.update(JSON.stringify(req.body));
    return req.headers['x-hub-signature-256'] === `sha256=${hmac.digest('hex')}`;
}
const rebuild = () => {
    const pwd = path.normalize(__dirname + '/../../susumio/');

    new Promise((resolve) => {
        exec('git pull --rebase && yarn && yarn run build', {cwd: pwd}, (error, stdout) => {
            if (error) {
                console.log(error)
            } else {
                console.log(stdout.toString())
                resolve();
            }
        });
    }).then(() => {
        return new Promise((resolve) => {
            exec('rm -rf public', {cwd: path.normalize(__dirname + '/../')}, (error, stdout) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(stdout.toString())
                    resolve();
                }
            });
        })
    }).then(() => {
        return new Promise((resolve) => {
            exec('mv -f dist ../webhooks/public', {cwd: pwd}, (error, stdout) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(stdout.toString())
                    resolve();
                }
            });
        })
    }).catch(err => {
        console.log(err)
    })
};
router.post('/', function (req, res, next) {


    if (verify_signature(req)) {
        rebuild();
        res.status(200).send('ok');
    } else {
        res.status(404).send('fail');
    }
});

module.exports = router;
