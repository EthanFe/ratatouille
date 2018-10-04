function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function findImage(image_id) {
    images_collection = document.images
    for(var i = 0; i < images_collection.length; i++) {
        if(images_collection[i].id == image_id) {
        return images_collection[i]
        }
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((Math.abs(x2 - x1) ** 2) + (Math.abs(y2 - y1) ** 2))
}

function getCurrentTime() {
    return new Date().valueOf()
}

function playGoodAudio(){
    var x = document.getElementsByClassName('play')[0]
    x.play()
}
function playBadAudio(){
    var x = document.getElementsByClassName('bad')[0]
    x.play()
}

function playBackgroundAudio(){
    var x = document.getElementsByClassName('background')[0]
    x.play()
}