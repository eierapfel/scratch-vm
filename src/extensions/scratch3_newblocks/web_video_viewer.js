
//const { registerFont, createCanvas, loadImage } = require('./node-canvas');
class WEBVideoViewer{
    constructor(){
        this._canvas = document.getElementsByClassName('stage_stage_1fD7k box_box_2jjDp')[0].getElementsByTagName('canvas')[0];
        this._background = document.getElementsByClassName('stage_stage-wrapper_eRRuk box_box_2jjDp')[0];
        console.log(this._canvas);
        console.log(this._background);
        console.log(this._canvas.getContext("2d"));
        this._image = document.createElement('img');
        this._image.src = 'http://localhost:8080/stream?topic=/image_raw';
        this._image.id = 'web_video';
        this._image.style.position = 'absolute';
        this._image.style.left = '0px';
        this._image.style.top = '0px';
        this._image.width = 150;
        this._image.height = 150;
        
        //this._web_canvas = document.createElement('canvas');
        //this._web_context = this._web_canvas.getContext('2d');
        var parent = this._canvas.parentNode;
        var child = this._background.firstChild;
        //parent.insertBefore(this._image,this._background);
        this._background.insertBefore(this._image, child.nextSibling);
        //this._background.appendChild(this._image);
        this._draw_canvas_id = null;
        console.log("constrouct finish");
        //this.drawCanvas();
        //var canvas_test = createCanvas(100, 100);
        //var context_test = canvas_test.getContext('2d');
        //console.log(canvas_test);
        //console.log(context_test);
        //this._width = this._canvas.width;
        //this._height = this._canvas.height;
    }

    drawCanvas (timestamp) {
        //this._web_context.clearRect(0, 0, this._width, this._height);
        //this._width = this._canvas.width;
        //this._height = this._canvas.height;
        /*this._web_context.drawImage(this._image,
            0, 0, this._image.width, this._image.height,
            0, 0, this._width, this._height);*/
        //this._width = this._canvas.width;
        //this._height = this._canvas.height;
        this._image.width = 150;
        this._image.height = 150;
        this._draw_canvas_id = window.requestAnimationFrame(()=>this.drawCanvas());
    }

    updateImage () {
        this._image.src = 'http://localhost:8080/stream?topic=/face_marker';
    }
    
    stopDrawingCanvas () {
        window.cancelAnimationFrame(this._draw_canvas_id);
    }

    restartDrawCanvas () {
        window.cancelAnimationFrame(this._draw_canvas_id);
        this.updateImage();
        this.drawCanvas() ;
    }
}

module.exports = WEBVideoViewer;