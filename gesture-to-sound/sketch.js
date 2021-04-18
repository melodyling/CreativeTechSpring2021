const video = document.getElementById("video");

let model;
let xCord;
let yCord;

let xCircle;
let yCircle;

let xPitch;
let yEcho;

const modelParams = {
 flipHorizontal: true,   // flip e.g for video
 imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
 maxNumBoxes: 2,        // maximum number of boxes to detect
 iouThreshold: 0.5,      // ioU threshold for non-max suppression
 scoreThreshold: 0.89,    // confidence threshold for predictions.
}

handTrack.startVideo(video).then(status => {
  if(status){
    navigator.getUserMedia(
      {video: {}}, stream => {
        video.srcObject = stream;
        setInterval(runDetection, 10);
      },
      err => console.log(err)
    );
  }
});

function runDetection() {
  model.detect(video).then(predictions => {
    if(predictions.length !== 0){
      let hand1 = predictions[0].bbox;
      xCord = hand1[0];
      yCord = hand1[1];

      var wave;
      var env;

      let xPitch = map(xCord, 0, 500, 0, 2000);
      let yEcho = map(yCord, 0, 350, 0, 0.9);

      env = new p5.Envelope();
      env.setADSR(yEcho, 0.9, yEcho, 0.9); //attack time, attack level, decay time, decay level
      env.setRange(1, 0); //max attack level, min release level

      wave = new p5.Oscillator();
      wave.setType("triangle");
      wave.start();
      wave.freq(xPitch);
      wave.amp(env);

      env.play();

      // console.log("xCord: " + xCord);
      // console.log("yCord: " + yCord);
      //
      // console.log("xPitch: " + xPitch);
      // console.log("yEcho: " + yEcho);
    }
  });
}

handTrack.load(modelParams).then(lmodel => {
  model = lmodel
});


function setup(){
  createCanvas(displayWidth, displayHeight);
}

function draw(){
  if(xCord != null && yCord != null){
    let xCircle = map(xCord, 0, 500, 0, displayWidth);
    let yCircle = map(yCord, 0, 350, 0, displayHeight);

    // console.log("xCircle: " + xCircle);
    // console.log("yCircle: " + yCircle);

    noStroke();
    fill(random(0, 255),random(0, 255),random(0, 255),100);
    circle(xCircle, yCircle, 40);
  }
}
