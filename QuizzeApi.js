const axios = require('axios');

const token = process.env.API_TOKEN;

module.exports = {
    async getQuizzeInfo(quizzeId) {
        try {
            let response = await axios.get(`https://api-kyf.sunstudio.io/profiles/1/quizzes/${quizzeId}`);
            return response.status == 200 && response.data ? response.data.data : false;
        } catch (err) {
            return false;
        }
    },

    async getQuizzeQuestions(quizVersionId) {
        try {
            let response = await axios.get(`https://api-kyf.sunstudio.io/system-quiz-versions/${quizVersionId}/questions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.status == 200 && response.data ? response.data.data : false;
        } catch (err) {
            return false;
        }
    }
}