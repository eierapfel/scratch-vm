
//const { registerFont, createCanvas, loadImage } = require('./node-canvas');
const cv = require('./opencv.js');

class WEBVideoViewer {
  constructor() {
    console.log('aaa');
    this._canvas = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0].getElementsByTagName('canvas')[0];
    this._canvas.position = 'absolute';
    this._canvas.left = '0px';
    this._canvas.top = '0px';
    console.log(this._canvas);
    this._background = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0];
    console.log(this._background);
    this._web_video_canvas = document.createElement('canvas');
    this._web_video_canvas.id = 'web_video_canvas';
    this._web_video_canvas.position = 'absolute';
    this._web_video_canvas.left = '0px';
    this._web_video_canvas.top = '0px';
    this._web_video_context = this._web_video_canvas.getContext('2d');
    this._image = document.createElement('img');
    this._image.src = 'http://localhost:8080/stream?topic=/image_raw';
    this._image.id = 'web_video';
    //this._image.width = 640;
    //this._image.height = 480;
    this._image.crossOrigin = 'Anonymous';
    this._web_video_canvas.width = parseInt(this._background.style.width, 10);
    this._web_video_canvas.height = parseInt(this._background.style.height, 10);
    //this._web_video_context.drawImage(this._image, 0, 0);

    //this._web_canvas = document.createElement('canvas');
    //this._web_context = this._web_canvas.getContext('2d');
    var parent = this._canvas.parentNode;
    var child = this._background.firstChild;
    //parent.insertBefore(this._web_video_canvas, this._canvas);
    parent.replaceChild(this._web_video_canvas, this._canvas);
    //this._background.insertBefore(this._web_video_canvas, child);
    //this._background.appendChild(this._image);
    this._draw_canvas_id = null;
    console.log("constrouct finish");
  }

  drawCanvas(timestamp) {
    try {
      this.updateDisplaySize();
      this._web_video_context.drawImage(this._image,
        0, 0, this._image.width, this._image.height,
        0, 0, this._web_video_canvas.width, this._web_video_canvas.height);
    } catch (e) {
      console.log(e);
    }
    //this.detectFace();
    /*try{
        var src = cv.imread(this._image);
        console.log('image width: ' + src.cols + '\n' +
            'image height: ' + src.rows + '\n' +
            'image size: ' + src.size().width + '*' + src.size().height + '\n' +
            'image depth: ' + src.depth() + '\n' +
            'image channels ' + src.channels() + '\n' +
            'image type: ' + src.type() + '\n');
        var dst = new cv.Mat();
        //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
        //cv.imshow('web_video_canvas', dst);
        src.delete(); dst.delete();
    } catch(e){
        console.log(e.message);
    }*/
    //var imgData = this._web_video_context.getImageData(0, 0, this._web_video_canvas.width, this._web_video_canvas.height);
    //let src = cv.matFromImageData(imgData);
    //var src = cv.imread(this._image);
    //var dst_gray = new cv.Mat();
    //cv.cvtColor(src, mat, cv.COLOR_RGBA2GRAY, 0);
    //let rect = new cv.Rect(100, 100, 200, 200);
    //mat = src.roi(rect);
    //var s = new cv.Scalar(255, 0, 0, 255);
    //cv.copyMakeBorder(src, dst, 10, 10, 10, 10, cv.BORDER_CONSTANT, s);
    //cv.cvtColor(src, dst_gray, cv.COLOR_RGBA2GRAY, 0); 
    //console.log(dst_gray);
    //cv.imshow(this._web_video_canvas, dst);
    //src.delete();
    //dst_gray.delete();
    //cv.imshow(this._web_video_canvas, mat);
    // scale and shift are used to map the data to [0, 255].
    //src.convertTo(dst, cv.CV_8U, 1/255);
    // *** is GRAY, RGB, or RGBA, according to src.channels() is 1, 3 or 4.
    //cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 1);
    //var imgData = new ImageData(new Uint8ClampedArray(dst.data, dst.cols, dst.rows), 480, 360);
    //this._web_video_context.putImageData(imgData, 0, 0);
    /*let src = cv.imread(this._image);
    let mat = new cv.Mat();
    cv.cvtColor(src, mat, cv.COLOR_RGBA2GRAY);
    cv.imshow(this._web_video_canvas, mat);*/

    //src.delete();
    //mat.delete();
    //this._width = this._canvas.width;
    //this._height = this._canvas.height;
    /*cv.readImage(this._image.src, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
        var dst_gray = new cv.Mat();
        //img_hsv = im.copy();
        //img_gray = im.copy();
        cv.cvtColor(im, dst_gray, cv.COLOR_RGBA2GRAY, 0); 
        //img_hsv.convertHSVscale();
        console.log(dst_gray.cols)
        this._image.src = img_gray.convertGrayscale();
        
    });*/
    //let dst = new cv.Mat();
    //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    //this._web_video_context.drawImage(this._image, 0, 0);
    this._draw_canvas_id = window.requestAnimationFrame(() => this.drawCanvas());
  }

  canDrawCanvas(url) {
    let tmp_img = new Image();
    tmp_img.src = url;
    try {
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.open("HEAD", url, false);
      xhr.send(null);
      var status = xhr.status;
      console.log(status);
      console.log('can draw canvas');
      return true;
    } catch (e) {
      console.log(e.name);
      return false;
    }
  }

  selectImageURL(ip) {
    let url = 'http://' + ip + ':8080/stream?topic=/image_raw'
    console.log(url);
    if (this.canDrawCanvas(url)) {
      this._image.src = url;
      window.cancelAnimationFrame(this._draw_canvas_id);
      this.drawCanvas();
    }
  }

  stopDrawingCanvas() {
    window.cancelAnimationFrame(this._draw_canvas_id);
  }

  convertGrayScale() {
    let src = cv.imread(this._image);
    let gray = new cv.Mat();
    let rsize = new cv.Size(this._web_video_canvas.width, this._web_video_canvas.height);
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.resize(gray, gray, rsize, 0, 0, cv.INTER_AREA);
    cv.imshow('web_video_canvas', gray);
    gray.delete(); src.delete();
  }

  updateDisplaySize() {
    this._web_video_canvas.width = parseInt(this._background.style.width, 10);
    this._web_video_canvas.height = parseInt(this._background.style.height, 10);
  }

  restartDrawCanvas() {
    window.cancelAnimationFrame(this._draw_canvas_id);
    //this.updateImage();
    this.drawCanvas();
  }
}

module.exports = WEBVideoViewer;