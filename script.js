const input = document.querySelector('#video-url-example');
const url ="http://tuurl.com"; //Definir URL
var chunkCounter;
const chunkSize = 1000000;  
var videoId = "";
var playerUrl = "";

input.addEventListener('change', () => {
    const file = input.files[0];
    const filename = input.files[0].name;
    var numberofChunks = Math.ceil(file.size/chunkSize);
    document.getElementById("video-information").innerHTML = "There will be " + numberofChunks + " chunks uploaded."
    var start =0; 
    var chunkEnd = start + chunkSize;
    createChunk(videoId, start);
});

function createChunk(videoId, start, end){
    chunkCounter++;
    console.log("created chunk: ", chunkCounter);
    chunkEnd = Math.min(start + chunkSize , file.size );
    const chunk = file.slice(start, chunkEnd);
    console.log("i created a chunk of video" + start + "-" + chunkEnd + "minus 1	");
        const chunkForm = new FormData();
    if(videoId.length >0){
        chunkForm.append('videoId', videoId);
        console.log("added videoId");	
        
    }
        chunkForm.append('file', chunk, filename);
    console.log("added file");
    uploadChunk(chunkForm, start, chunkEnd);
}

function uploadChunk(chunkForm, start, chunkEnd){
    var oReq = new XMLHttpRequest();
    oReq.upload.addEventListener("progress", updateProgress);	
    oReq.open("POST", url, true);
    var blobEnd = chunkEnd-1;
    var contentRange = "bytes "+ start+"-"+ blobEnd+"/"+file.size;
    oReq.setRequestHeader("Content-Range",contentRange);
    console.log("Content-Range", contentRange);
}

function updateProgress (oEvent) {
    if (oEvent.lengthComputable) {  
    var percentComplete = Math.round(oEvent.loaded / oEvent.total * 100);
    var totalPercentComplete = Math.round((chunkCounter -1)/numberofChunks*100 +percentComplete/numberofChunks);
    document.getElementById("chunk-information").innerHTML = "Chunk # " + chunkCounter + " is " + percentComplete + "% uploaded. Total uploaded: " + totalPercentComplete +"%";
	console.log (percentComplete);
    } else {
        console.log ("not computable");
    }
}

oReq.onload = function (oEvent) {
    console.log("uploaded chunk" );
    console.log("oReq.response", oReq.response);
    var resp = JSON.parse(oReq.response)
    videoId = resp.videoId;
    console.log("videoId",videoId);
    
    start += chunkSize;	
    if(start<file.size){
        createChunk(videoId, start);
    }
    else{
        playerUrl = resp.assets.player;
        console.log("all uploaded! Watch here: ",playerUrl ) ;
        document.getElementById("video-information").innerHTML = "all uploaded! Watch the video <a href=\'" + playerUrl +"\' target=\'_blank\'>here</a>" ;
    }
};
oReq.send(chunkForm);