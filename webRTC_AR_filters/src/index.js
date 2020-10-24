let ar_image = new Image();

const width = 1280;
const height = 720;
let filterOption = "";
let buttonContainer = document.getElementById('button_container');

let grayscaleBtn = document.createElement('button');
let arStickerBtn = document.createElement('button');
let removeFilterBtn = document.createElement('button');

let canvas = document.getElementById('filtered_canvas');
let context = canvas.getContext( '2d' );
let videoElement = document.createElement("video");

async function drawToCanvas() {
    context.drawImage( videoElement, 0, 0, width, height );
    
    if (filterOption === "ar_sticker") {
        context.drawImage(ar_image, 150, 200, 250, 400);
    } else if (filterOption === "grayscale") {
        let pixelData = context.getImageData( 0, 0, width, height );

        let avg, i;
        for( i = 0; i < pixelData.data.length; i += 4 ) {
            avg = ( pixelData.data[ i ] + pixelData.data[ i + 1 ] + pixelData.data[ i + 2 ] ) / 3;
            pixelData.data[ i ] = avg;
            pixelData.data[ i + 1 ] = avg;
            pixelData.data[ i + 2 ] = avg;
        }
        context.putImageData( pixelData, 0, 0 );
    } else {
        // do nothing
    }

    requestAnimationFrame( drawToCanvas );
}

function onGrayscaleClicked() {
    filterOption = 'grayscale';
    console.log("switch to grayscale");
}

function onArStickerClicked() {
    filterOption = 'ar_sticker';
    console.log("switch to ar sticker");
}

function onOriginalClicked() {
    filterOption = 'original';
    console.log("remove all filters");
}

grayscaleBtn.classList.add('btn');
grayscaleBtn.classList.add('btn-success');
grayscaleBtn.classList.add('custom_btn_length');
grayscaleBtn.innerText = "Grayscale";
grayscaleBtn.addEventListener( 'click', onGrayscaleClicked);
arStickerBtn.classList.add('btn');
arStickerBtn.classList.add('btn-info');
arStickerBtn.classList.add('custom_btn_length');
arStickerBtn.innerText = "AR Sticker";
arStickerBtn.addEventListener( 'click', onArStickerClicked);
removeFilterBtn.classList.add('btn');
removeFilterBtn.classList.add('btn-primary');
removeFilterBtn.classList.add('custom_btn_length');
removeFilterBtn.innerText = "Remove Filters";
removeFilterBtn.addEventListener( 'click', onOriginalClicked);

buttonContainer.appendChild(grayscaleBtn);
buttonContainer.appendChild(arStickerBtn);
buttonContainer.appendChild(removeFilterBtn);

Promise.all([
    ar_image.src = "img/duck2.png",
]).then(loadMedia)


function loadMedia() {
    ar_image.crossOrigin="Anonymous";
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720,
            }
        },
      }).then(stream => {
        
        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement.play();
        drawToCanvas();
      });
} 