
let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

function markBuffFound (buff) {
  const buffImageEl = document.getElementById(buff)
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
  let buffMat = cv.imread(buff)
  let dst = new cv.Mat();
  let mask = new cv.Mat();
  cv.matchTemplate(screenshot, buffMat, dst, cv.TM_CCOEFF_NORMED, mask)
  let result = cv.minMaxLoc(dst, mask);
  console.log(buff, 'result', result)
  console.log(buff, 'found?', result.maxVal > 0.7)

  if (result.maxVal > 0.7) {
    markBuffFound(buff)
  }

  buffMat.delete();
  dst.delete();
  mask.delete();
}

const buffList = [
  'familiars',
  'echo',
  'boss-rush',
  'mp-red',
  'mp-green'
]

imgElement.onload = function() {
  let screenshot = cv.imread(imgElement);
  // cv.imshow('canvasOutput', mat)

  buffList.forEach(buff => checkForBuff(buff, screenshot))



  // drawing
  // let maxPoint = result.maxLoc;
  // let color = new cv.Scalar(255, 0, 0, 255);
  // let point = new cv.Point(maxPoint.x + ga.cols, maxPoint.y + ga.rows);
  // cv.rectangle(mat, maxPoint, point, color, 2, cv.LINE_8, 0);

  // cv.imshow('canvasOutput', mat);

  screenshot.delete();
  // ga.delete();
  // dst.delete();
  // mask.delete();
};
 
var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized () {
    document.getElementById('status').innerHTML = 'Ready!';
  }
};
