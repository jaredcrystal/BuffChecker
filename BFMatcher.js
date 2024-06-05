
let imgElement = document.getElementById('imageSrc');

const skills = [
  'familiars',
  'echo',
  'guild-boss-slayers',
  'guild-for-the-guild',
  'guild-hard-hitter',
  'guild-undeterred',
  'house',
  'fame',
]
const stackingConsumables = [
  'mp-red',
  'mp-green',
  'mp-blue',
  'candied-apple',
  'legions-might',
  'guild-boss-slayers',
  'guild-for-the-guild',
  'guild-hard-hitter',
  'guild-undeterred',
  'blessing-of-the-guild',
  'ursus',
  'mvp',
]
const eventBuffs = ['vip']
const alchemy = ['exceptional-boost', 'legendary-hero']
const smithing = ['weapon-tempering']
const advStatPotions = [
  'adv-stat-pill',
  'adv-stat-pill2',
  'adv-stat-potion',
  'adv-stat-potion2',
]
const nonstackingConsumables1 = [
  'ssiws-cheese',
  'onyx-apple',
  'tengu',
  'cold-winter-energy',
  'overpower',
  'warrior-elixir',
  'wizard-elixir',
  'baby-dragon-food',
  'cider',
  'energizer-drink',
]
const nonstackingConsumables2 = [
  'red-star',
  'boss-rush',
]

let found = []

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
  found.push(buff.display)
}

function checkCategories () {
  if (skills.every(buff => found.includes(buff))) {
    document.getElementById('skills').classList.add('categoryComplete')
  }
  if (stackingConsumables.every(buff => found.includes(buff))) {
    document.getElementById('stacking-consumables').classList.add('categoryComplete')
  }
  if (eventBuffs.every(buff => found.includes(buff))) {
    document.getElementById('event-buffs').classList.add('categoryComplete')
  }
  if (alchemy.some(buff => found.includes(buff))) {
    document.getElementById('alchemy').classList.add('categoryComplete')
  }
  if (smithing.every(buff => found.includes(buff))) {
    document.getElementById('smithing').classList.add('categoryComplete')
  }
  if (advStatPotions.some(buff => found.includes(buff))) {
    document.getElementById('adv-stat-potions').classList.add('categoryComplete')
  }
  if (nonstackingConsumables1.some(buff => found.includes(buff))) {
    document.getElementById('nonstacking-consumables1').classList.add('categoryComplete')
  }
  if (nonstackingConsumables2.some(buff => found.includes(buff))) {
    document.getElementById('nonstacking-consumables2').classList.add('categoryComplete')
  }
}

function checkForBuff (buff, descriptors2) {
  console.log("checking:", buff.display)

  let bf = new cv.BFMatcher();

  // # Match descriptors.
  //var matches = new cv.DMatchVector();
  let matches = new cv.DMatchVectorVector();
  //bf.match(descriptors1, descriptors2, matches)
  try {
    bf.knnMatch(buff.descriptors, descriptors2, matches, 2);
  } catch (error) {
    console.log('too big')
  }

  // console.log('matches', matches.size())
  
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
  
  if (counter > 1) {
    markBuffFound(buff)
  }
}

let orb = null;
let buffList = [
  { display: 'familiars', algo: 'familiars' },
  { display: 'echo', algo: 'echo' },
  { display: 'guild-boss-slayers', algo: 'guild-boss-slayers' },
  { display: 'guild-for-the-guild', algo: 'guild-for-the-guild' },
  { display: 'guild-hard-hitter', algo: 'guild-hard-hitter' },
  { display: 'guild-undeterred', algo: 'guild-undeterred' },
  { display: 'house', algo: 'house' },
  { display: 'fame', algo: 'fame-full' },
  { display: 'mp-red', algo: 'mp-red-white-bg' },
  { display: 'mp-green', algo: 'mp-green-white-bg' },
  { display: 'mp-blue', algo: 'mp-blue-white-bg' },
  { display: 'candied-apple', algo: 'candied-apple-white-bg' },
  { display: 'legions-might', algo: 'legions-might' },
  { display: 'blessing-of-the-guild', algo: 'blessing-guild-full' },
  { display: 'ursus', algo: 'ursus-full' },
  { display: 'mvp', algo: 'mvp' },
  { display: 'vip', algo: 'vip' },
  { display: 'exceptional-boost', algo: 'exceptional-boost-white-bg' },
  { display: 'legendary-hero', algo: 'legendary-hero-white-bg' },
  { display: 'weapon-tempering', algo: 'weapon-tempering' },
  { display: 'adv-stat-pill', algo: 'adv-stat-pill-white-bg' },
  { display: 'adv-stat-pill2', algo: 'adv-stat-pill2-white-bg' },
  { display: 'adv-stat-potion', algo: 'adv-stat-potion-white-bg' },
  { display: 'adv-stat-potion2', algo: 'adv-stat-potion2-white-bg' },
  { display: 'ssiws-cheese', algo: 'ssiws-cheese-white-bg' },
  { display: 'onyx-apple', algo: 'onyx-apple-white-bg' },
  { display: 'tengu', algo: 'tengu' },
  { display: 'cold-winter-energy', algo: 'cold-winter-energy' },
  { display: 'overpower', algo: 'overpower' },
  { display: 'warrior-elixir', algo: 'warrior-elixir-white-bg' },
  { display: 'wizard-elixir', algo: 'wizard-elixir-white-bg' },
  { display: 'baby-dragon-food', algo: 'baby-dragon-food-white-bg' },
  { display: 'cider', algo: 'cider-white-bg' },
  { display: 'energizer-drink', algo: 'energizer-drink-white-bg' },
  { display: 'boss-rush', algo: 'boss-rush-white-bg' },
  { display: 'red-star', algo: 'red-star-white-bg' },
];

function checkBuffs () {
  try {
    let im2 = cv.imread(imgElement);
    let screenshot = new cv.Mat();
    // console.log("cols/rows", im2.cols, im2.rows)
    // scale up the screenshot:
    let dsize = new cv.Size(im2.cols*5, im2.rows*5);

    cv.resize(im2, screenshot, dsize, 0, 0, cv.INTER_AREA);
    // grayscale the screenshot:
    let im2Gray = new cv.Mat();
    cv.cvtColor(screenshot, im2Gray, cv.COLOR_BGRA2GRAY);
    // detectAndCompute keypoints and descriptors on the screenshot:
    let keypoints2 = new cv.KeyPointVector();
    let descriptors2 = new cv.Mat();
    orb.detectAndCompute(im2Gray, new cv.Mat(), keypoints2, descriptors2);

    buffList.forEach((buff, i) => {
      setTimeout(() => {
        document.getElementById('status').innerHTML = `checking buffs... ${parseInt((i+1)/buffList.length*100)}%`;
        checkForBuff(buff, descriptors2)
      }, i)
    })

    setTimeout(() => {
      checkCategories()
      document.getElementById('status').innerHTML = ''
    }, 100)
  } catch (error) {
    document.getElementById('status').innerHTML = 'Screenshot is too big. Capture only the buff bar.'
  }
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
        document.getElementById('status').innerHTML = 'processing your screenshot...'
        imgElement.src = event.target.result
      };
      reader.readAsDataURL(blob);
    }
  }
}
var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized () {
    document.getElementById('status').innerHTML = 'processing buff icons...';

    orb = new cv.AKAZE();
    console.log('prepping buff icons')
    buffList.forEach(buff => {
      // read the buff image
      let im1 = cv.imread(buff.algo)
      // resize (make it 5x bigger)
      let buffMat = new cv.Mat();
      let dsize = new cv.Size(im1.cols*5, im1.rows*5);
      cv.resize(im1, buffMat, dsize, 0, 0, cv.INTER_AREA);
      // grayscale it
      let im1Gray = new cv.Mat();
      cv.cvtColor(buffMat, im1Gray, cv.COLOR_BGRA2GRAY);
      let keypoints1 = new cv.KeyPointVector();
      let descriptors1 = new cv.Mat();
      // find the keypoints and descriptors with ORB
      orb.detectAndCompute(im1Gray, new cv.Mat(), keypoints1, descriptors1);
      // save the descriptors in the buff object
      buff.descriptors = descriptors1;
    })
    console.log('done with icons')
    document.getElementById('status').innerHTML = 'Ready! Paste a screenshot of your buff bar.';
  }
};