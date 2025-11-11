let currentSong = new Audio;
let songs;
let currfolder;
let sv = currentSong.volume;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) =>{
    currentSong.src = `/${currfolder}` + track
    if(!pause){
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function getsongs(folder){
    currfolder = folder;
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Husnain</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
        </li>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    return songs

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            if(folder != "songs")
            {
                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json();
                cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
                </div>

                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>`
            }
        }
    }



    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })
}

async function main() {
    
    songs = await getsongs("songs/cs");
    playMusic(songs[0], true)

    await displayAlbums();

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%";
        if(currentSong.currentTime == currentSong.duration){
            play.src = "play.svg"
        }
    })

    document.querySelector(".seekbaar").addEventListener("click", e =>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", ()=>{
        let s = "/" + currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(s)
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })


    next.addEventListener("click", ()=>{

        let s = "/" + currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(s)
        if((index+1)< songs.length){
            playMusic(songs[index+1])
        }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=>{
        currentSong.volume = parseInt(e.target.value)/100
        vs = document.querySelector(".volume>img")
        if(document.querySelector(".range").getElementsByTagName("input")[0].value == 0)
        {
            vs.src = "mute.svg"
        }
        else
        {
            vs.src = "volume.svg"
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    document.addEventListener("keypress", e=>{
        if(e.key == " "){
            if(currentSong.paused){
                currentSong.play()
                play.src = "pause.svg"
            }
            else{
                currentSong.pause();
                play.src = "play.svg"
            }
        }
        if(e.key == "M" || e.key == "m"){
            if(currentSong.volume != 0){
                currentSong.volume = 0
                vs = document.querySelector(".volume>img")
                    vs.src = "mute.svg"
                    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
            }
            else{
                currentSong.volume = .10
                vs = document.querySelector(".volume>img")
                    vs.src = "volume.svg"
                    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
        }
    })

    document.addEventListener("keydown", e=>{
        if(e.key == "ArrowRight"){
            let se = Math.floor(currentSong.currentTime)
            if(se < currentSong.duration)
            {
                currentSong.currentTime = currentSong.currentTime+10;
            }
        }
        else if(e.key == "ArrowLeft"){
            let se = Math.floor(currentSong.currentTime)
            if(se > 0)
            {
                currentSong.currentTime = currentSong.currentTime-10;
            }
        }
        if(e.key == "ArrowUp")
        {
            if(currentSong.volume+.10 >= 1)
                {
                    
                    currentSong.volume = 1;
                    document.querySelector(".range").getElementsByTagName("input")[0].value = 100
                } 
            else if(currentSong.volume < 1)
            {
                vs = document.querySelector(".volume>img")
                vs.src = "volume.svg"
                currentSong.volume = currentSong.volume +.10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = + currentSong.volume*100
                
                
            }
        }
        else if(e.key == "ArrowDown")
        {
            if(currentSong.volume-.10 <= 0)
                {
                    currentSong.volume = 0;
                    vs = document.querySelector(".volume>img")
                    vs.src = "mute.svg"
                    document.querySelector(".range").getElementsByTagName("input")[0].value = 0
                } 
            else if(currentSong.volume > 0)
            {
                currentSong.volume = currentSong.volume -.10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = + currentSong.volume*100
            }
        }
    })
}

main();