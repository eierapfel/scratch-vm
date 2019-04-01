
class WEBVideoViewer {
  constructor() {
    console.log('aaa');
    this._canvas = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0].getElementsByTagName('canvas')[0];
    this._canvas.position = 'absolute';
    this._canvas.left = '0px';
    this._canvas.top = '0px';
    this._background = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0];
    this._web_video_canvas = document.createElement('canvas');
    this._web_video_canvas.id = 'web_video_canvas';
    this._web_video_canvas.position = 'absolute';
    this._web_video_canvas.left = '0px';
    this._web_video_canvas.top = '0px';
    this._web_video_context = this._web_video_canvas.getContext('2d');
    this._image = document.createElement('img');
    this._image.src = 'http://localhost:8080/stream?topic=/image_raw';
    this._image.id = 'web_video';
    this._image.crossOrigin = 'Anonymous';
    this._web_video_canvas.width = parseInt(this._background.style.width, 10);
    this._web_video_canvas.height = parseInt(this._background.style.height, 10);
    var parent = this._canvas.parentNode;
    parent.replaceChild(this._web_video_canvas, this._canvas);
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

  /*convertGrayScale() {
    let src = cv.imread(this._image);
    let gray = new cv.Mat();
    let rsize = new cv.Size(this._web_video_canvas.width, this._web_video_canvas.height);
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.resize(gray, gray, rsize, 0, 0, cv.INTER_AREA);
    cv.imshow('web_video_canvas', gray);
    gray.delete(); src.delete();
  }*/

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