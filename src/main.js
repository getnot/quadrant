
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

quadrantTasker = async (quadrantId, addtask, deleteTask ) => {
    chrome.storage.sync.get(['quadrantTasklist'], (result) => {
        let quadrantTasks = result.quadrantTasklist ? result.quadrantTasklist : new Map();
        let taskList = quadrantTasks[quadrantId] ? quadrantTasks[quadrantId] : [];

        if (addtask) {
            let form_div_id = `q-${quadrantId}-f`;
            let task = document.getElementById(form_div_id).value;
            document.getElementById(form_div_id).value = '';
            if (task) {
                taskList = addTask(quadrantTasks, quadrantId, task, taskList);
                populateTasks(quadrantId, null, task);
            }
        } else if(deleteTask) {
            taskList = taskList.filter(task => task != deleteTask);
            quadrantTasks[quadrantId] = taskList;
            chrome.storage.sync.set({ quadrantTasklist: quadrantTasks }, () => {
                console.log('Value is set to ' , quadrantTasks);
            });
        } else {
            populateTasks(quadrantId, taskList, null);
        }

        
    });
}

addTask = (quadrantTasks, quadrantId, task , taskList) => {
    taskList.push(task);
    quadrantTasks[quadrantId] = taskList;
    chrome.storage.sync.set({ quadrantTasklist: quadrantTasks }, () => {
        console.log('Value is set to ' , quadrantTasks);
    });
    return taskList;
}

populateTasks = async (quadrantId, taskList, task) => {
    // let text_div_id = `q-${quadrantId}-t`;
    // quadrant1List = document.getElementById(text_div_id);
    // let newListElement = document.createElement("li"); 
    // li.innerHTML = task;
    // quadrant1.innerHTML = (
    //     ` <div>
    //          ${taskList.map((task, index) => `<input type="checkbox" id="${text_div_id + '-' + index}"><label for="${text_div_id + '-' + index}">${task}</label><br>`).join("\n")}
    //      </div>`
    // );

    let text_div_id = `q-${quadrantId}-t`;
    quadrant1List = document.getElementById(text_div_id);
    console.log("populate taskkk", taskList, task);
    if (taskList) {
        taskList.forEach(element => {
            addtaskInTaskListAndAttachListner(quadrantId, quadrant1List, element);
        });
    } else {
        addtaskInTaskListAndAttachListner(quadrantId, quadrant1List, task);
    }

}

addtaskInTaskListAndAttachListner = (quadrantId, ul, task) => {

    if (task === "") {
        return ;
    }
    let li = document.createElement("li");
    li.innerHTML = task;
    li.onclick = () => {
        ul.removeChild(li);
        quadrantTasker(quadrantId, null, task);
    }

    if (ul.childElementCount == 0) {
        ul.appendChild(li);
    } else {
        ul.insertBefore(li, ul.firstChild);
    }
}

document.getElementById("q-1-b").onclick = (event) => {
    event.preventDefault();
    quadrantTasker(1, true, null)
};
document.getElementById("q-2-b").onclick = (event) => {
    event.preventDefault();
    quadrantTasker(2, true, null)
};
document.getElementById("q-3-b").onclick = (event) => {
    event.preventDefault();
    quadrantTasker(3, true, null)
};
document.getElementById("q-4-b").onclick = (event) => {
    event.preventDefault();
    quadrantTasker(4, true, null)
};


quadrantTasker(1, false, null);
quadrantTasker(2, false, null);
quadrantTasker(3, false, null);
quadrantTasker(4, false, null);