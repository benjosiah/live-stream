

let start = false
let chunck =  []
window.onload = function (){
    navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: true
    }).then(stream =>{
        document.getElementById('video').srcObject = stream
        console.log(stream);
        
        mediaRecorder = new MediaRecorder(stream);
    })
}

document.getElementById('btn').onclick = function(){
    if (start==false) {
        start=true
        console.log("recording...........")
        mediaRecorder.start(1000);

        mediaRecorder.ondataavailable = (e) =>{
            chunck.push(e.data);
            var formData = new FormData();
            var file = new File([e.data], 'file.mp4', {
                type: 'video/mp4',
                lastModified: Date()
            });
            formData.append("file", file)
            console.log(e.data)
            console.log(formData)
            axios.post('/upload', formData).then((res)=>{
                console.log(res)
            })

           
        }
    }
    else{
        start=false
        mediaRecorder.stop()
    }
    
    setTimeout(() => {
        const blob = new Blob(chunck, {
            type: "video/webm"
        } );

        let url = URL.createObjectURL(blob);
        console.log(url);
    }, 10010);

}