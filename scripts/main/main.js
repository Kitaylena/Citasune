// main page
const now = new Date();
const time = now.toLocaleTimeString();

const randomtext = document.getElementById("randomtext");
const list = 
["hellooo",
"its literally " + time + " what are u doing rn",
"All Hail To Benjamin Netanyahu!",
"kids be doing ANYTHING but their work",
"i recently got into touhou, now i know bad apple is a touhou song",]
randomtext.innerHTML = list[Math.floor(Math.random() * list.length)];

//