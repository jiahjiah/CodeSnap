const fileSelector = document.querySelector('input');
const start = document.querySelector('.start-button');
const wantsNotes = document.querySelector('.notes-toggle');
const progress = document.querySelector('.progress');
const textarea = document.querySelector('.box2');
const title = document.querySelector('.title')

fileSelector.onchange = () => {
  var file = fileSelector.files[0];
  var imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }));
  console.log(textarea)
};

var currentScanned = '';
var provideComment = false;

start.onclick = () => {
  textarea.innerHTML = '';
  const rec = new Tesseract.TesseractWorker();
  rec.recognize(fileSelector.files[0])
    // .progress(function (response) {
    //   console.log(response);
    //   progress.innerHTML = 'Processing';
    // })
    .then(function (data) {
      console.log(data);
      currentScanned = data.text;
      runCompletion(currentScanned, provideComment);
    });
};

// Load prompt into GPT
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
      console.log(data.ans);
      textarea.innerHTML = data.ans;
      //.innerHTML = 'Done!';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const notesToggle = document.querySelector('#switch');

  notesToggle.addEventListener('change', function () {
    provideComment = notesToggle.checked;
    console.log('Provide Comment:', provideComment);
  });
});

window.addEventListener('DOMContentLoaded', (event) => {
  const fileInput = document.getElementById('file-input');
  const box = document.querySelector('.box');
  const box2 = document.querySelector('.box2'); // Add reference to box2
  const uploadStatus = document.querySelector('.upload-status');
  const startButton = document.querySelector('.start-button');

  fileInput.addEventListener('change', () => {
    const fileName = fileInput.value.split('\\').pop(); // Extract the filename from the input value
    uploadStatus.textContent = `Uploaded file: ${fileName}`;
    uploadStatus.parentNode.classList.add('uploaded');
  });

  function replaceBoxContent() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileReader = new FileReader();

      fileReader.onload = function (e) {
        const image = document.createElement('img');
        image.src = e.target.result;
        image.addEventListener('load', () => {
          const imageHeight = image.height;
          box.style.backgroundImage = `url("${e.target.result}")`;
          box.style.height = `${imageHeight}px`;
        });
      };

      fileReader.readAsDataURL(file);
      uploadStatus.style.display = 'none';
      document.querySelector('.upload-button').style.display = 'none';
      document.querySelector('.buttons').style.display = 'none';

      box2.style.display = 'block'; // Display box2
      //title.innerHTML = '<h1>loading<h1>'
    }
  }

  startButton.addEventListener('click', replaceBoxContent);
});
