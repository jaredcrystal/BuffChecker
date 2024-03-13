
let imgElement = document.getElementById('imageSrc');
// let inputElement = document.getElementById('fileInput');
// inputElement.addEventListener('change', (e) => {
//   imgElement.src = URL.createObjectURL(e.target.files[0]);
// }, false);

// let buffElement = document.getElementById('buffSrc');
// let buffInputElement = document.getElementById('buffInput');
// buffInputElement.addEventListener('change', (e) => {
//   buffElement.src = URL.createObjectURL(e.target.files[0]);
// }, false);

function markBuffFound (buff) {
  if (!buff.display) return
  const buffImageEl = document.getElementById(buff.display)
  const parent = buffImageEl.parentNode
  const imgContainer = document.createElement('div')
  imgContainer.classList.add('imgContainer')
  const checkmark = document.createElement('div')
  checkmark.classList.add('center')
  checkmark.innerText = '✔️'
  parent.replaceChild(imgContainer, buffImageEl)
  imgContainer.appendChild(buffImageEl)
  imgContainer.appendChild(checkmark)
}

function checkForBuff (buff, screenshot) {
  let im1 = cv.imread(buff.algo)
  let buffMat = new cv.Mat();
  let dsize = new cv.Size(im1.cols*5, im1.rows*5);
  // You can try more different parameters
  cv.resize(im1, buffMat, dsize, 0, 0, cv.INTER_AREA);
  // console.log('buffMat', buffMat)
  // console.log('screenshot', screenshot)
  let im1Gray = new cv.Mat();
  let im2Gray = new cv.Mat();
  cv.cvtColor(buffMat, im1Gray, cv.COLOR_BGRA2GRAY);
  cv.cvtColor(screenshot, im2Gray, cv.COLOR_BGRA2GRAY);
  // cv.imshow('canvasOutput1', im1Gray);
  // cv.imshow('canvasOutput2', im2Gray);
  let keypoints1 = new cv.KeyPointVector();
  let keypoints2 = new cv.KeyPointVector();
  let descriptors1 = new cv.Mat();
  let descriptors2 = new cv.Mat();


  // let mask = new cv.Mat();
  console.log("KAZE")
  // Initiate ORB detector
  // let orb = new cv.ORB()
  let orb = new cv.AKAZE();
  // let orb = new cv.BRISK()
  // let orb = new cv.KAZE()


  // find the keypoints and descriptors with ORB
  orb.detectAndCompute(im1Gray, new cv.Mat(), keypoints1, descriptors1);
  console.log('done computing1')
  orb.detectAndCompute(im2Gray, new cv.Mat(), keypoints2, descriptors2);
  console.log('done computing2')

  // console.log('keypoints1:', keypoints1.size(), 'keypoints2:', keypoints2.size())
  // console.log('descriptors1:', descriptors1.size(), 'descriptors2:', descriptors2.size())
  // create BFMatcher object
  // bf = new cv.BFMatcher(cv.NORM_HAMMING, true)
  let bf = new cv.BFMatcher();

  // # Match descriptors.
  //var matches = new cv.DMatchVector();
  let matches = new cv.DMatchVectorVector();
  //bf.match(descriptors1, descriptors2, matches)
  bf.knnMatch(descriptors1, descriptors2, matches, 2);

  console.log('matches', matches.size())
  
  let good_matches = new cv.DMatchVector();
  let knnDistance_option = 0.7;
  let counter = 0;
  for (let i = 0; i < matches.size(); ++i) {
      let match = matches.get(i);
      // console.log('match', match)
      let dMatch1 = match.get(0);
      let dMatch2 = match.get(1);
      //console.log("[", i, "] ", "dMatch1: ", dMatch1, "dMatch2: ", dMatch2);
      if (dMatch1.distance <= dMatch2.distance * parseFloat(knnDistance_option)) {
          //console.log("***Good Match***", "dMatch1.distance: ", dMatch1.distance, "was less than or = to: ", "dMatch2.distance * parseFloat(knnDistance_option)", dMatch2.distance * parseFloat(knnDistance_option), "dMatch2.distance: ", dMatch2.distance, "knnDistance", knnDistance_option);
          good_matches.push_back(dMatch1);
          counter++;
      }
  }

  console.log('good matches size:', good_matches.size())

  // console.log("keeping ", counter, " points in good_matches vector out of ", matches.size(), " contained in this match vector:", matches);

  // console.log("here are first 5 matches");
  // for (let t = 0; t < matches.size(); ++t) {
  //     console.log("[" + t + "]", "matches: ", matches.get(t));
  //     if (t === 5){break;}
  // }
    
  // console.log("here are first 5 good_matches");
  // for (let r = 0; r < good_matches.size(); ++r) {
  //     console.log("[" + r + "]", "good_matches: ", good_matches.get(r));
  //     if (r === 5){break;}
  // }

  //draw:
  let imMatches = new cv.Mat();
  let color = new cv.Scalar(0,255,0, 255);
  cv.drawMatches(buffMat, keypoints1, screenshot, keypoints2, 
                    good_matches, imMatches, color);
  cv.imshow('canvasOutput3', imMatches);
  
  if (counter > 1) {
    markBuffFound(buff)
  }

  buffMat.delete();
  // dst.delete();
  // mask.delete();
}

const buffList = [
  { display: 'familiars', algo: 'familiars' },
  { display: 'echo', algo: 'echo' },
  { display: 'boss-rush', algo: 'boss-rush-white-bg' },
  { display: 'mp-red', algo: 'mp-red-white-bg' },
  { display: 'mp-green', algo: 'mp-green-white-bg' },
  { display: 'candied-apple', algo: 'candied-apple-white-bg' },
  { display: 'legions-might', algo: 'legions-might' },
  { display: 'guild-boss-slayers', algo: 'guild-boss-slayers' },
  { display: 'guild-for-the-guild', algo: 'guild-for-the-guild' },
  { display: 'guild-hard-hitter', algo: 'guild-hard-hitter' },
  { display: 'guild-undeterred', algo: 'guild-undeterred' },
  { display: 'blessing-of-the-guild', algo: 'blessing-guild-full' },
  { display: 'ursus', algo: 'ursus-full' },
  { display: 'mvp', algo: 'mvp' },
  { display: 'exceptional-boost', algo: 'exceptional-boost-white-bg' },
  { display: 'legendary-hero', algo: 'legendary-hero-white-bg' },
  { display: 'weapon-tempering', algo: 'weapon-tempering' },
  { display: 'adv-state-pill', algo: 'adv-state-pill-white-bg' },
  { display: 'adv-state-pill2', algo: 'adv-state-pill2-white-bg' },
  { display: 'adv-state-potion', algo: 'adv-state-potion-white-bg' },
  { display: 'adv-state-potion2', algo: 'adv-state-potion2-white-bg' },
  { display: 'ssiws-cheese', algo: 'ssiws-cheese-white-bg' },
  { display: 'onyx-apple', algo: 'onyx-apple-white-bg' },
  { display: 'tengu', algo: 'tengu' },
  { display: 'cold-winter-energy', algo: 'cold-winter-energy' },
  { display: 'warrior-elixir', algo: 'warrior-elixir-white-bg' },
  { display: 'wizard-elixir', algo: 'wizard-elixir-white-bg' },
  { display: 'baby-dragon-food', algo: 'baby-dragon-food-white-bg' },
  { display: 'cider', algo: 'cider-white-bg' },
  { display: 'energizer-drink', algo: 'energizer-drink-white-bg' },
]

function checkBuffs () {
  let im2 = cv.imread(imgElement);
  let screenshot = new cv.Mat();
  // console.log("cols/rows", im2.cols, im2.rows)
  let dsize = new cv.Size(im2.cols*5, im2.rows*5);
  cv.resize(im2, screenshot, dsize, 0, 0, cv.INTER_AREA);

  buffList.forEach(buff => checkForBuff(buff, screenshot))
  // checkForBuff({algo: 'buffSrc'}, screenshot)

  screenshot.delete();
}

imgElement.onload = checkBuffs

document.onpaste = function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  // console.log(JSON.stringify(items)); // will give you the mime types
  for (index in items) {
    var item = items[index];
    if (item.kind === 'file') {
      var blob = item.getAsFile();
      var reader = new FileReader();
      reader.onload = function (event) {
        // console.log(event.target.result) // data url!
        // imgElement.src = URL.createObjectURL(e.target.files[0]);
        imgElement.src = event.target.result
      };
      reader.readAsDataURL(blob);
    }
  }
}
var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized () {
    document.getElementById('status').innerHTML = 'Ready!';
  }
};