require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expressNunjucks = require('express-nunjucks');

const QuizzeApi = require('./QuizzeApi');

const app = express();

const isDev = app.get('env') === 'development';

console.log(isDev);

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});


app.get('/', (req, res) => {
    return res.render('index');
});

app.post('/', async (req, res) => {
    try {
        let {quizze_id} = req.body;
        if (!quizze_id) {
            return res.sendStatus(400);
        }

        let quizzeInfo = await QuizzeApi.getQuizzeInfo(quizze_id);

        if (!quizzeInfo) {
            return res.sendStatus(400);
        }

        let questions = await QuizzeApi.getQuizzeQuestions(quizzeInfo.systemQuizVersionId);

        let questionResults = quizzeInfo.questions.reduce((result, question) => {
            result[question.systemQuizQuestionId] = question.selectedOptionId;
            return result;
        }, {});


        return res.render('index', {questionResults, questions, quizzeInfo});
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Running on port ${port}`);
})