const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require('body-parser');
const cors = require('cors');


const express = require('express')
const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello woo')
})


//create prompt
function createPrompt(code, comment) {
    let prompt;
    if (comment) {
        prompt = "correct missing chars, reformat this code, add comments, ensure that the output can be used in and IDE directly";
    }
    else {
        prompt = "format this code by getting rid of line numbers if there are and do not write any comments";
    }
    prompt += "\n\n```\n" + code + "\n```"
    return prompt;
}

app.post('/chatAPI', async (req, res) => {
    //load prompt into gpt
    
    const configuration = new Configuration({ apiKey: "hahaha", });
    const openai = new OpenAIApi(configuration);

    newPrompt = createPrompt(req.body.Text, req.body.Comment);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: newPrompt,
        max_tokens: 600
    });
    // completion.then((value) => {
    // console.log(completion);
    // console.log(completion.data.choices[0].text);

    ret = {
        'ans': completion.data.choices[0].text
    }

    res.json(ret);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})