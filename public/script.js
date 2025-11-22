// now fetching the songs
// let songsurl = new URL("http://127.0.0.1:3000/public/songs"); // this is only for Local hosting.
let response;
songs = [];
songsname = [];
async function getsongs(){
    //response = await fetch(songsurl); // this line is only for local hosting
    //response = await response.text(); // this line is for local hosting
    response = await fetch("songs.json"); // this is for vercel hosting or local hosting
    response = await response.json();
    //console.log(response);


// this below code is only for local hosting
 /*   let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div);
    let tagA = div.getElementsByTagName("a");
     console.log(tagA);

    for(i=0;i<tagA.length;i++){
        if(tagA[i].href.endsWith("mp3")){
        songs.push(tagA[i].href);
        // also getting songs names
        songsname.push(tagA[i].innerText);
    }
    }
    // removing .mp3 from songs name
    for(i=0;i<songsname.length;i++){
        songsname[i]=songsname[i].replace(".mp3","");
    }
    // console.log(songsname);

    */


   // these below lines are of vercel hosting and we just storing the respose array(which contain songs link) to song (array) for clarity.
    songs = response; 
    // getting songs name
    for(let i in songs){
        songsname[i] = songs[i].replace(".mp3","");
        songsname[i] = songsname[i].replace("songs/","");
    }
    //console.log(songsname);
    // -> end
};
//now fetching the pictures
//let imgurl = new URL("http://127.0.0.1:3000/public/songs-img/"); // this line is for local hosting
let imgresponse;
img = [];
async function getimg(){
    //imgresponse = await fetch(imgurl); // this line is for local hosting
    //imgresponse = await imgresponse.text(); // this line is only for local hosting
    // console.log(imgresponse);
    imgresponse = await fetch("songs-img.json"); // this line is for vercel hosting.
    imgresponse = await imgresponse.json(); // this line is for vercel hosting.
    // these below lines are for local hosting
    /*let div = document.createElement("div");
    div.innerHTML = imgresponse;
    // console.log(div);
    let tagA = div.getElementsByTagName("a");
    // console.log(tagA);
    for(i=0;i<tagA.length;i++){
        if(tagA[i].href.endsWith("jpg")){
        img.push(tagA[i].href);}
    }
    */
   // -> end
   img = imgresponse; // this line is for vercel hosting.
   
};
// linking images to cards
(function linkImgToCard(){
let songsimg = document.getElementsByClassName("cardimg");
getimg().then(()=>{
    for(i=0;i<songsimg.length;i++){
    songsimg[i].setAttribute("src",img[i]);
}
});
})();
// linking songs and songs names to cards
(function linkSongAndNameToCard(){
// linking songs to cards
let playbuttonaudiolink = document.getElementsByClassName("playbuttonaudio");
let accessingeachcard = document.querySelectorAll(".eachcard");
getsongs().then(()=>{
    for(i=0;i<playbuttonaudiolink.length;i++){
    playbuttonaudiolink[i].setAttribute("src",songs[i]);
}
prevANDforwardTrackLogiv();
//linking songs name
for(let i=0;i<accessingeachcard.length;i++){
    accessingeachcard[i].children[1].innerText = songsname[i];
}
});
})();
// slider output func
(function slideroutputfunc(){
var sliderrange = document.getElementById("sliderrange");
let sliderouput = document.getElementById("slideroutput");

sliderrange.addEventListener("input",()=>{
    slideroutput.innerText = sliderrange.value;
    slideroutput.style.left = `${sliderrange.value}%`;
    outputbtnpositioncalc();
})
sliderrange.addEventListener("mouseenter",()=>{
    slideroutput.innerText = sliderrange.value;
})
})();
// slideroutput position calculator func
function outputbtnpositioncalc(){
    let value = sliderrange.value;
    if(value<=50 && value>=40){
        slideroutput.style.transform = 'translatex(-50%)';
    }
    if(value<=39 && value>=30){
        slideroutput.style.transform = 'translatex(-20%)';
    }
    if(value<=14 && value>=10){
         slideroutput.style.transform = 'translatex(-10%)';
    }
    if(value<10){
        slideroutput.style.transform = 'translatex(50%)';
    }
    if(value<=70 && value>=60){
        slideroutput.style.transform = 'translatex(-65%)';
    }
     if(value<=80 && value>=71){
        slideroutput.style.transform = 'translatex(-70%)';
    }
    if(value<=90 && value>=81){
        slideroutput.style.transform = 'translatex(-78%)';
    }
    if(value<=100 && value>=91){
        slideroutput.style.transform = 'translatex(-80%)';
    }
}
function songAudioUpdate(){
    function Ref(){
        song.volume = (sliderrange.value/100);
    }
    song.removeEventListener("timeupdate",Ref)
    song.addEventListener("timeupdate",Ref);
}
//trying to preload the audio
(function preload(){
    let allAudioTagList = document.querySelectorAll("audio");
    for(let i of allAudioTagList){
        i.load();
    }
})();
//------------------------------------------------------------------------------------------------
let mainbtn = document.querySelector("#mainplaypause");
let buttons = document.querySelectorAll(".playbutton");
let songRangeBar = document.querySelector("#songrangebar");
let songRangeOutput = document.querySelector(".songrangeoutput");
var song = null;
let previoussong = null;
let previousbutton = null; // keep record of previous click btn
let timeupdate2funcRef;
let play = null;
let mainplay = null;
let songendedmonitoring = null;
let smallbtnRef = null;
let isMainPlayBtnPress = null;
songRangeBar.addEventListener("input",stopMovingRangeBarButton); // to stop range bar from moving util user press button.
const body = (smallbtn)=>{
        if(isMainPlayBtnPress === true){
            if(song.paused === false){
                song.pause();
                updateutilities();
            }
        }
        smallbtnRef = smallbtn;
		song = smallbtn.querySelector("audio");
		if(smallbtn !== previousbutton){
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
            if(previoussong !== null && previoussong.paused === false){
                updateutilities(smallbtn);
                previoussong.pause();
            } // of inner if
			(()=>{
			song.load();
			song.play();

			updateutilities(smallbtn);
			})(); // of Ife expression
			previousbutton = smallbtn;
            previoussong = song;
		} // of if condition
		else if(smallbtn === previousbutton){
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
			if(song.paused === false){
				song.pause();
				updateutilities(smallbtn);
			} // of if
			else if(song.paused){
				song.play();
				updateutilities(smallbtn);
			} // of inner else-if
		} // of outer else-if
	}

buttons.forEach((smallbtn)=>{
	smallbtn.addEventListener("click",()=>{body(smallbtn)}); // click event listner
}) // of for each

function updateutilities(smallbtn){
    songAudioUpdate();
    let mainbtnsvg = mainbtn.querySelector("img");
    if(smallbtn !== undefined){
	let btnsvg = smallbtn.querySelector("img");
    if(isMainPlayBtnPress === true){
        let parent = song.parentElement;
        let btnsvg = parent.querySelector("img");
        if(btnsvg){
            btnsvg.src = "svg/play.svg";
        }
        isMainPlayBtnPress = false;
        }
	if(smallbtn !== previousbutton || isPrevTrack == true){
        if(previoussong !== null && previoussong.paused === false){
            let previoussvg = previousbutton.querySelector("img");
            previoussvg.src = "svg/play.svg";
            mainbtnsvg.src = "svg/play.svg";
         } // of inner if
         else{
            btnsvg.src = "svg/pause.svg";
		    mainbtnsvg.src = "svg/pause.svg";
		    updateSongNameWithRangeBar(smallbtn);
         }
	} // of if condition
	else if(smallbtn === previousbutton){
		if(song.paused){
			btnsvg.src = "svg/play.svg";
			mainbtnsvg.src = "svg/play.svg";
			updateSongNameWithRangeBar(smallbtn);
		}// end of inner if
		else if(song.paused === false){
			btnsvg.src = "svg/pause.svg";
			mainbtnsvg.src = "svg/pause.svg";
			updateSongNameWithRangeBar(smallbtn);
		}// of inner else-if
	} // of else-if
    } // of if
    else if(play !== null){
        let songparent = song.parentElement;
        let songsvg = songparent.querySelector("img");
        if(play === false){
            mainbtnsvg.src = "svg/play.svg";
            songsvg.src = "svg/play.svg";
            updateSongNameWithRangeBar();
        }
        else if(play === true){
            mainbtnsvg.src = "svg/pause.svg";
            songsvg.src = "svg/pause.svg";
            updateSongNameWithRangeBar();
        }
    }// of else-if
    else if(smallbtnRef === null){
        let parent = song.parentElement;
        let songsvg = parent.querySelector("img");
        if(mainplay === true){
            mainbtnsvg.src = "svg/pause.svg";
            songsvg.src = "svg/pause.svg";
        }
        else if(mainplay === false){
            mainbtnsvg.src = "svg/play.svg";
            songsvg.src = "svg/play.svg";
        }
        else if(songendedmonitoring === true){
            songsvg.src = "svg/play.svg";
        }
        else if(songendedmonitoring === false){
            songsvg.src = "svg/pause.svg"
        }
        updateSongNameWithRangeBar();
     } // of else if
} // of main function
 
function updateSongNameWithRangeBar(smallbtn){
    if(smallbtn !== undefined){
        let parent = smallbtn.parentElement;
	    let songname = parent.children[1].innerText;
	    let songnamecontainer = document.querySelector("#songname");
	    songnamecontainer.innerText = songname;
	    updateSongRangeBar(smallbtn);
    }
    else if(smallbtnRef === null){
        let parent = song.parentElement.parentElement;
        let songname = parent.children[1].innerText;
        let songnamecontainer = document.querySelector("#songname");
	    songnamecontainer.innerText = songname;
        updateSongRangeBar();
    }
    else{
        updateSongRangeBar();
    }
	
}

function updateSongRangeBar(smallbtn){
    if(smallbtn !== undefined){
	if(smallbtn !== previousbutton){
           a(smallbtn); 
	} // of if
	else if(smallbtn === previousbutton){
		if(song.paused === false){
			songRangeBar.value = Math.floor(song.currentTime);
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
            a(smallbtn);
		} // of inner if
		else if(song.paused){
			song.removeEventListener("loadedmetadata",loadedmetadata);
            song.removeEventListener("timeupdate",timeupdate1);
            songRangeBar.removeEventListener("input",input);
            song.removeEventListener("timeupdate",timeupdate2);
            stopMovingRangeBarButton();
            songRangeBar.addEventListener("input",stopMovingRangeBarButton);
		} // of inner else-if
	} // of outer else-if
    } // of if
    else if(play !== null){
        if(play === false){
            song.removeEventListener("loadedmetadata",loadedmetadata);
            song.removeEventListener("timeupdate",timeupdate1);
            songRangeBar.removeEventListener("input",input);
            song.removeEventListener("timeupdate",timeupdate2);
            stopMovingRangeBarButton();
            songRangeBar.addEventListener("input",stopMovingRangeBarButton);
        } // of if
        else if(play === true){
            songRangeBar.value = Math.floor(song.currentTime);
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
            a(smallbtn);
        }
    } // of else if
    else if(smallbtnRef === null){
        if(mainplay === true){
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
            songRangeBar.value = Math.floor(song.currentTime);
            a();
        }
        else if(mainplay === false){
            song.removeEventListener("loadedmetadata",loadedmetadata);
            song.removeEventListener("timeupdate",timeupdate1);
            songRangeBar.removeEventListener("input",input);
            song.removeEventListener("timeupdate",timeupdate2); 
            stopMovingRangeBarButton();
            songRangeBar.addEventListener("input",stopMovingRangeBarButton);
        }
        else if(songendedmonitoring === true){
            song.removeEventListener("loadedmetadata",loadedmetadata);
            song.removeEventListener("timeupdate",timeupdate1);
            songRangeBar.removeEventListener("input",input);
            song.removeEventListener("timeupdate",timeupdate2); 
            stopMovingRangeBarButton();
            songRangeBar.addEventListener("input",stopMovingRangeBarButton);
        }
        else if(songendedmonitoring === false){
            songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
            songRangeBar.value = Math.floor(song.currentTime);
            a();
        }

    } // of else if
} // of function updateSongRangeBar

function a(smallbtn){
    timeupdate2funcRef = function timeupdate2func(){timeupdate2(smallbtn)};
	song.removeEventListener("loadedmetadata",loadedmetadata);
	song.addEventListener("loadedmetadata",loadedmetadata);
	song.removeEventListener("timeupdate",timeupdate1);
	song.addEventListener("timeupdate",timeupdate1);
	songRangeBar.removeEventListener("input",input);
	songRangeBar.addEventListener("input",input);
	song.removeEventListener("timeupdate",timeupdate2funcRef);
	song.addEventListener("timeupdate",timeupdate2funcRef);
}


function loadedmetadata(){
	songRangeBar.max = Number(Math.floor(song.duration));
} // of function loadedmetadata
function timeupdate1(){
	songRangeBar.value = Number(Math.floor(song.currentTime));
} // of function timeupdate
function input(){
	song.currentTime = songRangeBar.value;
	if(song.paused){
		song.play();
		song.currentTime = songRangeBar.value;
	} // of if condition
    
} // of function input
function timeupdate2(smallbtn){
    let minute = Math.floor(song.currentTime/60);
    let seconds = Math.floor(song.currentTime%60);
	songRangeOutput.innerText = `${String(minute).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    if(smallbtn !== undefined){
        if(smallbtn === previousbutton){
	        if(song.paused){
                songRangeOutput.innerText = "";
            } // end of inner if
            function whenSongStopPlaying(){ updateutilities(smallbtn)};
            song.addEventListener("ended",whenSongStopPlaying);
        } // end of if
    } // end of if
    else if(smallbtnRef === null){
        if(mainplay === false){
	        if(song.paused){
                songRangeOutput.innerText = "";
            } // end of inner if
            function whenSongStopPlaying(){ updateutilities()};
            song.addEventListener("ended",whenSongStopPlaying);
        } // end of if
    }

} // of function timeupdate2
function stopMovingRangeBarButton(){
	songRangeBar.value = 0;
} // of function stopMovingRangeBarButton

let currentPoint = 0;
let load = false;
let endedmonitorfuncRef = null;
mainbtn.addEventListener("click",()=>{
    songRangeBar.removeEventListener("input",stopMovingRangeBarButton);
    if(smallbtnRef === null){
        isMainPlayBtnPress = true;
        let allSongs = document.querySelectorAll("audio");
        song = allSongs[currentPoint];
        if(mainplay === true){
            song.pause();
            mainplay = false;
            updateutilities();
            song.removeEventListener("ended",endedmonitorfuncRef);
        }
        else{
            if(load === false){
                song.load();
                load = true;
            }
            song.play();
            mainplay = true;
            updateutilities();
            if(endedmonitorfuncRef === null){
            endedmonitorfuncRef = function endedmonitorfunc(){
            song.removeEventListener("ended",endedmonitorfuncRef);
            songendedmonitoring = true;
            mainplay = null;
            updateutilities();
            currentPoint++;
            if(currentPoint === allSongs.length){
                currentPoint = 0;
            }
                console.log(currentPoint);
                song = allSongs[currentPoint];
                song.load();
                song.play();
                songendedmonitoring = false;
                updateutilities();
                mainplay = true;
                song.addEventListener("ended",endedmonitorfuncRef);
            
        }
       }
            song.addEventListener("ended",endedmonitorfuncRef);
            
        }
    }
    else if(song.paused === false && song !== null){
        song.pause();
        play = false;
        updateutilities();
    }
    else if(song.paused === true && song !== null){
        song.play();
        play = true;
        updateutilities();
    }
    
})
// add logic to back and forward the songs in track.
var isPrevTrack = false; 
function prevANDforwardTrackLogiv(){
    let allAudioTagList = document.querySelectorAll("audio");
    let allAudioTagSrc = [];
    for(let i=0;i<allAudioTagList.length;i++){
        allAudioTagSrc[i] = allAudioTagList[i].getAttribute("src");
    }
    //console.log(allAudioTagSrc);
    let previousTrack = document.getElementById("previousTrack");
    let forwardTrack = document.getElementById("forwardTrack");
    let songSrc = null;
    previousTrack.addEventListener("click",()=>{
        if(song != null){
            let playingSongIndex;
            songSrc = song.getAttribute("src");
            for(let i in allAudioTagSrc){
                if(songSrc == allAudioTagSrc[i]){
                    playingSongIndex = i;
                    break;
                }
            }
            let prevIndex = 0;
            if(playingSongIndex == 0){
                return;
            }else if(playingSongIndex > 0){
                prevIndex = playingSongIndex-1;
            }
            //console.log(allAudioTagSrc[prevIndex]);
            let prevSong;
            prevSong = allAudioTagList[prevIndex];
            let btn = song.parentElement;
            body(btn);
            song = prevSong;
            let songbtn = song.parentElement;
            body(songbtn);
        }
    });
    forwardTrack.addEventListener("click",()=>{
        if(song != null){
            let playingSongIndex;
            songSrc = song.getAttribute("src");
            for(let i in allAudioTagSrc){
                if(songSrc == allAudioTagSrc[i]){
                    playingSongIndex = Number(i);
                    break;
                }
            }
            let nextIndex = 0;
            if(playingSongIndex == allAudioTagSrc.length-1){
                return;
            }
            else if(playingSongIndex < allAudioTagSrc.length-1){
                nextIndex = playingSongIndex + 1;
            }
            //console.log(allAudioTagSrc[prevIndex]);
            let nextSong;
            nextSong = allAudioTagList[nextIndex];
            let btn = song.parentElement;
            body(btn);
            song = nextSong;
            let songbtn = song.parentElement;
            body(songbtn);
        
        }
    });
}

    







































































































// // playing songs feature execute
// songplaying();
// let currentsong = null;
// function songplaying(){
// //song playing feature
// let playbutton = document.querySelectorAll(".playbutton");
// let currentbutton;
// let song;
// playbutton.forEach((button)=>{
//     button.addEventListener("click",()=>{
//         song = button.querySelector("audio");
//         let buttonimg = button.querySelector("img");
//         // if the same song is double clicked -> play and pause.
//         if(button === currentbutton){
//             if(!song.paused){
//                 buttonimg.setAttribute("src","svg/play.svg");
//                 song.pause();
//             }
//             else{
//                 if(song.paused){
//                     buttonimg.setAttribute("src","svg/pause.svg");
//                     song.play();
//                 }
//             }
//         }else if(button !== currentbutton){
//             // if another song is playing then stop its playing and start new song.
//             if(currentsong !== null){
//             if(!currentsong.paused){
//                 currentbutton.querySelector("img").setAttribute("src","svg/play.svg");
//                 currentsong.pause();
//             };
//             };
//             // playing song
//             buttonimg.setAttribute("src","svg/pause.svg");
//             song.load();
//             song.play();
//             currentsong = song;
//             currentbutton = button;
//             songrangecontrol();
//         }
//         mainplaypause1();
        
//     })
    
// })
// }


// function mainplaypause1(){
//     // this function updating the mainplaypause bar icons when clicks on each card
//     let mainplaypause = document.getElementById("mainplaypause");
//     let mainplaypauseimg = document.getElementById("mainplaypauseimg");
//     if(currentsong !== null){
//     if(!currentsong.paused){
//         mainplaypauseimg.src="svg/pause.svg";
//     }
//     else if(currentsong.paused){
//         mainplaypauseimg.src="svg/play.svg";
//     }
// }
// };

// function updatingEachCardSvg(){
//     let parent = currentsong.parentElement;
//     let svgTag = parent.querySelector("img");
//     if(currentsong.paused){
//         svgTag.src = "svg/play.svg";
//     }
//     else if(!currentsong.paused){
//         svgTag.src = "svg/pause.svg";
//     }
// }

// (function mainplaypause2(){
//       mainplaypause.addEventListener("click",()=>{
//         if(currentsong !== null){
//             if(currentsong.paused){
//                 currentsong.play();
//                 mainplaypauseimg.src="svg/pause.svg";
//                 updatingEachCardSvg();
//             }
//             else if(!currentsong.paused){
//                 currentsong.pause();
//                 mainplaypauseimg.src="svg/play.svg";
//                 updatingEachCardSvg();
//             }
//         }
//         else if(currentsong === null){
//             let Allsongs = document.querySelectorAll("audio");
//             currentIndex = 0;
//             play();
//             function play(){
//                 if(currentIndex>=Allsongs.length){
//                     currentIndex = 0;
//                 }
//                 currentsong = Allsongs[currentIndex];
//                 currentsong.play();
//                 updatingEachCardSvg();
//                 mainplaypause1();
//             }
//             currentsong.addEventListener("ended",()=>{
//                 currentIndex++;
//                 play();
//             })
//             }
//     })
// })();




