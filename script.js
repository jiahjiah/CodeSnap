const fileSelector = document.querySelector('input')
const start = document.querySelector('button')
const img = document.querySelector('img')
const progress = document.querySelector('.progress')
const textarea = document.querySelector('textarea')

fileSelector.onchange = () => {
    console.log("helo00");
    var file = fileSelector.files[0]
    var imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }))
    img.src = imgUrl
}

var currentScanned = ""

start.onclick = () => {

    console.log("helos");

    textarea.innerHTML = ''
    const rec = new Tesseract.TesseractWorker()
    rec.recognize(fileSelector.files[0])
        .progress(function (response) {
            console.log(response);
            progress.innerHTML = "Processing"
            // if (response.status == 'recognizing text') {
            //     progress.innerHTML = response.status + ' ' + response.progress
            // } else {
            //     progress.innerHTML = response.status
            // }
        })
        .then(function (data) {
            console.log(data);
            //test code
            //const test = '#include <iostream>using namespace std;int main() {int first_number, second_number, sum;cout << "Enter two integers: ";cin >> first_number >> second_number;sum = first_number + second_number;cout << first_number << " + " <<  second_number << " = " << sum;     return 0;}';
            let provideComment = true;
            //test code
            // textarea.innerHTML = data.text
            currentScanned = data.text
            runCompletion(currentScanned, provideComment);
        })
}

//load prompt into gpt
async function runCompletion(text, comment) {

    const url = 'http://127.0.0.1:3000/chatAPI';
    const requestBody = { Text: text, Comment: comment };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            // Process the response data
            console.log(data.ans);
            textarea.innerHTML = data.ans
            progress.innerHTML = 'Done!'
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        }
        );

}

