
setTime = () => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hr_rotation = 30 * hr + min / 2; //converting current time
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;
}

setTime();

setInterval(() => {
    setTime();
}, 1000);

isQuadrant = false;
document.getElementById("gear").onclick = (event) => {
    event.preventDefault();
    isQuadrant = !isQuadrant;
    if (isQuadrant) {
        document.getElementById("main").style.display = "none";
        document.getElementById("quadrant").style.display = "grid";
    } else {
        document.getElementById("quadrant").style.display = "none";
        document.getElementById("main").style.display = "grid";
    }
}

document.getElementById("refresh").onclick = () => fetchBackGroundImageFromIndexDb(true);


var quadrantStorage = 'quadrantStorage';
let indexdb = window.indexedDB.open(quadrantStorage, 1);
let db = null

indexdb.onupgradeneeded = () => {
    db = indexdb.result;
    if (!db.objectStoreNames.contains(quadrantStorage)) {
        db.createObjectStore(quadrantStorage, { keyPath: 'id' });
    }
};
indexdb.onsuccess = () => {
    db = indexdb.result;
    fetchBackGroundImageFromIndexDb(false);
}

saveBackgroundImageInIndexDB = (key, data) => {
    let transaction = db.transaction("quadrantStorage", "readwrite");
    let storage = transaction.objectStore("quadrantStorage");
    let request = storage.put({ id: key, value: data });

    request.onsuccess = function () {
        console.log("record stored in db", request.result);
    };

    request.onerror = function () {
        console.log("Error", request.error);
    };
}

fetchBackGroundImageFromIndexDb = (refreshImage) => {

    let imageKey = "backgroundImage";

    if (refreshImage) {
        fetchAndSaveNewbackgoundImageImage(imageKey);
    } else {
        let transaction = db.transaction("quadrantStorage");
        let storage = transaction.objectStore("quadrantStorage");
        req = storage.get(imageKey);
        req.onsuccess = () => {
            if (req.result) {
                let image_Src = window.URL.createObjectURL(req.result.value);
                document.body.style.backgroundImage = `url(${image_Src})`;
            } else {
                fetchAndSaveNewbackgoundImageImage(imageKey);
            }
        }
    }
}

fetchAndSaveNewbackgoundImageImage = (imageKey) => {
    let img_url = "https://unsplash.it/1920/1080"
    fetch(img_url)
        .then(res => res.blob())
        .then(data => {
            let image_Src = window.URL.createObjectURL(data);
            document.body.style.backgroundImage = `url(${image_Src})`;
            saveBackgroundImageInIndexDB(imageKey, data);
        })
        .catch(error => console.log(error));
}

// fetch jo mama joke
fetch('https://yomomma-api.herokuapp.com/jokes')
    .then(res => res.json())
    .then(data => {
        document.getElementById("jo-mama").innerHTML = `<p> ${data.joke} </p>`;
    })
    .catch(error => console.log(error));