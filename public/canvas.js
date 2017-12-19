'use strict';

(function() {

  var socket = io();
  // This object holds the implementation of each drawing tool.
  var tools = {};
  var textarea;
  var colorPicked;
  var lineWidthPicked;
  var SelectedFontFamily;
  var SelectedFontSize;
  
  
// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context, canvaso, contexto;

  // The active tool instance.
  var tool;
  var tool_default = 'pencil';

  function init () {
    // Find the canvas element.
    canvaso = document.getElementById('imageView');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }

    // Add the temporary canvas.
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
      alert('Error: I cannot create a new canvas element!');
      return;
    }

    canvas.id     = 'imageTemp';
    canvas.width  = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');

    // Get the tool select input.
   // var tool_select = document.getElementById('dtool');
    var tool_select = document.getElementById('pencil-button');
   
    //tool_select.addEventListener('change', ev_tool_change, false);
    
    //Choose colour picker
    colorPicked = $("#colour-picker").val();
    
    $("#colour-picker").change(function(){
        colorPicked = $("#colour-picker").val();
    });
    
    //Choose line Width
    lineWidthPicked = $("#line-Width").val();
        
    $("#line-Width").change(function(){
        lineWidthPicked = $("#line-Width").val();
    });
    
    //SelectedFontFamily
    SelectedFontFamily = $("#draw-text-font-family").val();
    
    $("#draw-text-font-family").change(function(){
        SelectedFontFamily = $("#draw-text-font-family").val();
    })
    
    //SelectedFontSize
    SelectedFontSize = $("#draw-text-font-size").val();
    
    $("#draw-text-font-family").change(function(){
        SelectedFontSize = $("#draw-text-font-size").val();
    })
    

    // Activate the default tool.
    if (tools[tool_default]) {
      tool = new tools[tool_default]();
      tool_select.value = tool_default;
    }
    
    function pic_tool_click(pick){
        if (tools[pick.value]) {
          tool = new tools[pick.value]();
        }
    }
    
    $("#pencil-button").click(function(){
        pic_tool_click(this)
    });
    
    $("#rect-button").click(function(){
        pic_tool_click(this)
    });
    
     $("#circle-button").click(function(){
        pic_tool_click(this)
    });
    
    $("#ellipse-button").click(function(){
        pic_tool_click(this)
    });
    
    $("#line-button").click(function(){
        pic_tool_click(this)
    });
    
    $("#text-button").click(function(){
        pic_tool_click(this)
    });
    
    
    
    //Draw Grids
  function SketchGrid(gridSize) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
        var w = canvas.width;
        var h = canvas.height;
        var gridWidth, gridColor;
        
       
       if(gridSize == "normal"){
           gridWidth = 25;
           gridColor = "#e7e8e8";
       }else if(gridSize == "medium"){
           gridWidth = 45;
           gridColor = "#e7e8e8";
       }else if(gridSize == "large"){
           gridWidth = 65;
           gridColor = "#e7e8e8";
       }else if(gridSize == "nogrid"){
           gridWidth = 25;
           gridColor = "#fff";  //no grid
       }

       /**
         * i is used for both x and y to draw
         * a line every 5 pixels starting at
         * .5 to offset the canvas edges
         */
         
        context.beginPath();  //important draw new everytime
        
        for(var i = .5; i < w || i < h; i += gridWidth) {
            // draw horizontal lines
            context.moveTo( i, 0 );
            context.lineTo( i, h);
            // draw vertical lines
            context.moveTo( 0, i );
            context.lineTo( w, i);
        }
        context.strokeStyle = gridColor;
        //contexto.strokeStyle = 'hsla(0, 0%, 40%, .5)';
        context.stroke();

    }
    
    /*var SelectedGrid = $("#draw-grid").val();
    
    SketchGrid(SelectedGrid)  //Calling drawing grid fn
    
    $("#draw-grid").change(function(){
        var SelectedGrid = $("#draw-grid").val();
        SketchGrid(SelectedGrid)  //Calling drawing grid fn
    });*/
    
    
      // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    //canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mousemove', throttle(ev_canvas, 10), false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  // The general-purpose event handler. This function just determines the mouse 
  // position relative to the canvas element.
  function ev_canvas (ev) {
      //console.log(ev)
      var CanvPos = canvas.getBoundingClientRect();  //Global Fix cursor position bug
    if (ev.clientX || ev.clientX == 0) { // Firefox
      //ev._x = ev.clientX;
      ev._x = ev.clientX - CanvPos.left;
     // ev._x = ev.layerX;
      //ev._y = ev.clientY;
      ev._y = ev.clientY - CanvPos.top;
      //ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      //ev._x = ev.offsetX;
      //ev._y = ev.offsetY;
    }
    
    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
    //Hide textbox if not equals to text tool

    
  }

  // The event handler for any changes made to the tool selector.
  function ev_tool_change (ev) {
    if (tools[this.value]) {
      tool = new tools[this.value]();
    }
  }
  
  
  // This function draws the #imageTemp canvas on top of #imageView, after which 
  // #imageTemp is cleared. This function is called each time when the user 
  // completes a drawing operation.
  function img_update(trans) {
		contexto.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
//        console.log(tool)
        if (!trans) { return; }

        socket.emit('copyCanvas', {
          transferCanvas: true
        });
  }
  
    function onCanvasTransfer(data){
            img_update();
    }
  
  socket.on('copyCanvas', onCanvasTransfer);

  

  // The drawing pencil.
  function drawPencil(x0, y0, x1, y1, color, linewidth, emit){
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
        if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;
        context.stroke();
        context.closePath();

        if (!emit) { return; }
        var w = canvaso.width;
        var h = canvaso.height;

        socket.emit('drawing', {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color: colorPicked,
          lineThickness: lineWidthPicked
        });
    }
    
    function onDrawingEvent(data){
        var w = canvaso.width;
        var h = canvaso.height;
        drawPencil(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.lineThickness);
    }
    
    socket.on('drawing', onDrawingEvent);
  
  
  tools.pencil = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        //context.beginPath();
        //context.moveTo(ev._x, ev._y);
        tool.started = true; 
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        drawPencil(tool.x0, tool.y0, ev._x, ev._y, colorPicked, lineWidthPicked, true);
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  };
  
  //Rect
  function drawRect(min_x, min_y, abs_x, abs_y, color, linewidth, emit){
          
            context.clearRect(0, 0, canvas.width, canvas.height); 
        if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
        if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;
            context.strokeRect(min_x, min_y, abs_x, abs_y);
            
            if (!emit) { return; }
            var w = canvaso.width;
            var h = canvaso.height;

            socket.emit('rectangle', {
              min_x: min_x / w,
              min_y: min_y / h,
              abs_x: abs_x / w,
              abs_y: abs_y / h,
              color: colorPicked,
              lineThickness: lineWidthPicked
            });
        
    }
    
    function onDrawRect(data){
        var w = canvaso.width;
        var h = canvaso.height;
        console.log("IN")
        drawRect(data.min_x * w, data.min_y * h, data.abs_x * w, data.abs_y * h, data.color, data.lineThickness);
    }
    
    socket.on('rectangle', onDrawRect);


  // The rectangle tool.
  tools.rect = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    
   //above the tool function

    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }

      var pos_x = Math.min(ev._x,  tool.x0),
          pos_y = Math.min(ev._y,  tool.y0),
          pos_w = Math.abs(ev._x - tool.x0),
          pos_h = Math.abs(ev._y - tool.y0);

      context.clearRect(0, 0, canvas.width, canvas.height); //in drawRect

      if (!pos_w || !pos_h) {
        return;
      }
        //console.log("emitting")
      drawRect(pos_x, pos_y, pos_w, pos_h, colorPicked, lineWidthPicked, true);
      //context.strokeRect(x, y, w, h); // in drawRect
    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  };
  //Lines
   function drawLines(x0, y0, x1, y1, color, linewidth, emit){
          context.clearRect(0, 0, canvas.width, canvas.height); 
          context.beginPath();
          context.moveTo(x0, y0);
          context.lineTo(x1, y1);
          if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
         if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;
          context.stroke();
          context.closePath();
          
            
            if (!emit) { return; }
            var w = canvaso.width;
            var h = canvaso.height;

            socket.emit('linedraw', {
              x0: x0 / w,
              y0: y0 / h,
              x1: x1 / w,
              y1: y1 / h,
              color: colorPicked,
              lineThickness: lineWidthPicked
            });
        
    }
    
    function onDrawLines(data){
        var w = canvaso.width;
        var h = canvaso.height;
        drawLines(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.lineThickness);
    }
    
    socket.on('linedraw', onDrawLines);


  // The line tool.
  tools.line = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    
    
    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
        drawLines(tool.x0, tool.y0, ev._x, ev._y, colorPicked, lineWidthPicked, true);

    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
    
  };
  
  //The Circle tool
  
  //Old Circle Function
  function old_drawCircle(x1, y1, x2, y2, color, linewidth, emit){
       
            context.clearRect(0, 0, canvas.width, canvas.height); 
            
               var radiusX = (x2 - x1) * 0.5,
                radiusY = (y2 - y1) * 0.5,
                centerX = x1 + radiusX,
                centerY = y1 + radiusY,
                step = 0.01,
                a = step,
                pi2 = Math.PI * 2 - step;
            
            context.beginPath();
            context.moveTo(centerX + radiusX * Math.cos(0),
                       centerY + radiusY * Math.sin(0));

            for(; a < pi2; a += step) {
                context.lineTo(centerX + radiusX * Math.cos(a),
                           centerY + radiusY * Math.sin(a));
            }
            
            context.closePath();
        if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
        if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;  
            context.stroke();
        
            
            if (!emit) { return; }
            var w = canvaso.width;
            var h = canvaso.height;

            socket.emit('circledraw', {
              x1: x1 / w,
              y1: y1 / h,
              x2: x2 / w,
              y2: y2 / h,
              color: colorPicked,
              lineThickness: lineWidthPicked
            });
        
    }
  
  //New Circle Function
  function drawCircle(x1, y1, x2, y2, color, linewidth, emit){
      
      context.clearRect(0, 0, canvas.width, canvas.height); 
 
    var x = (x2 + x1) / 2;
    var y = (y2 + y1) / 2;
 
    var radius = Math.max(
        Math.abs(x2 - x1),
        Math.abs(y2 - y1)
    ) / 2;
 
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2, false);
    // context.arc(x, y, 5, 0, Math.PI*2, false);
     context.closePath();
        if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
        if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;  
            context.stroke();
        
            
            if (!emit) { return; }
            var w = canvaso.width;
            var h = canvaso.height;

            socket.emit('circledraw', {
              x1: x1 / w,
              y1: y1 / h,
              x2: x2 / w,
              y2: y2 / h,
              color: colorPicked,
              lineThickness: lineWidthPicked
            });
    
  }
  
   
    
    function onDrawCircle(data){
        var w = canvaso.width;
        var h = canvaso.height;
        drawCircle(data.x1 * w, data.y1 * h, data.x2 * w, data.y2 * h, data.color, data.lineThickness);
    }
    
    socket.on('circledraw', onDrawCircle);


  // The Circle tool.
  tools.circle = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    
    
    this.mousedown = function (ev) {
      tool.started = true;
      var rect = canvas.getBoundingClientRect();
      tool.x1 = ev.clientX - rect.left;
      tool.y1 = ev.clientY - rect.top;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      
      var rect = canvas.getBoundingClientRect();
        tool.x2 = ev.clientX - rect.left;
        tool.y2 = ev.clientY - rect.top;
    
        context.clearRect(0, 0, canvas.width, canvas.height); 
        drawCircle(tool.x1, tool.y1, tool.x2, tool.y2, colorPicked, lineWidthPicked, true);
        
        //context.strokeStyle = 'rgba(255, 0, 0, 0.5)'; //for old_drawCircle
        //context.strokeRect(x1, y1, x2-x1, y2-y1);

    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
    
  };
  
  //Ellipse Tool 
  

  function drawEllipse(x, y, w, h, color, linewidth, emit){
      
      context.clearRect(0, 0, canvas.width, canvas.height); 
    var ox, oy, xe, ye, xm, ym;
    var kappa = .5522848;
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle
 
      context.beginPath();
      context.moveTo(x, ym);
      context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      context.closePath();
    
        if(color)
            context.strokeStyle = "#"+color;
        else
            context.strokeStyle = "#"+colorPicked; 
        if(linewidth)
            context.lineWidth = linewidth;
        else
            context.lineWidth = lineWidthPicked;  
            context.stroke();
        
            
            if (!emit) { return; }
            var canv_w = canvaso.width;
            var canv_h = canvaso.height;

            socket.emit('ellipsedraw', {
              x: x,
              y: y,
              w: w,
              h: h,
              color: colorPicked,
              lineThickness: lineWidthPicked
            });
    
  }
  
   
    
    function onDrawEllipse(data){
        var w = canvaso.width;
        var h = canvaso.height;
        drawEllipse(data.x, data.y, data.w, data.h, data.color, data.lineThickness);
    }
    
    socket.on('ellipsedraw', onDrawEllipse);


  // The Ellipse tool.
  tools.ellipse = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    
    
    this.mousedown = function (ev) {
      tool.started = true;
        tool.x0 = ev._x;
      tool.y0 = ev._y;
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      
        var x = Math.min(ev._x, tool.x0);
		var y = Math.min(ev._y, tool.y0);
		
		var w = Math.abs(ev._x - tool.x0);
		var h = Math.abs(ev._y - tool.y0);
      
        context.clearRect(0, 0, canvas.width, canvas.height); 
        drawEllipse(x, y, w, h, colorPicked, lineWidthPicked, true);

    };

    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
    
  };
  
  
  
  
 //Text Tool start
 
textarea = document.createElement('textarea');
textarea.id = 'text_tool';
textarea.focus();
textarea.className += " form-control";
container.appendChild(textarea);

// Text tool's text container for calculating
// lines/chars
var tmp_txt_ctn = document.createElement('div');
tmp_txt_ctn.style.display = 'none';
container.appendChild(tmp_txt_ctn);


var onDrawTextBox = function(ev_x, ev_y, tool_x0, tool_y0) {
		
		 //context.clearRect(0, 0, canvas.width, canvas.height); 
      
        var x = Math.min(ev_x, tool_x0);
        var y = Math.min(ev_y, tool_y0);
        var width = Math.abs(ev_x - tool_x0);
        var height = Math.abs(ev_y - tool_y0);
         
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = width + 'px';
        textarea.style.height = height + 'px';
         
        textarea.style.display = 'block';
	};
    
    
function DrawText(fsize, ffamily, colorVal, textPosLeft, textPosTop, processed_lines, emit){
        context.font = fsize + ' ' + ffamily;
        context.textBaseline = 'top';
        context.fillStyle = "#"+colorVal;
         
        for (var n = 0; n < processed_lines.length; n++) {
            var processed_line = processed_lines[n];
             
            context.fillText(
                processed_line,
                parseInt(textPosLeft),
                parseInt(textPosTop) + n*parseInt(fsize)
            );
        }
        
        img_update(); //Already emitting no need true param
        
        if (!emit) { return; }
            var w = canvaso.width;
            var h = canvaso.height;

            socket.emit('textdraw', {
              fsize: fsize,
              ffamily: ffamily,
              colorVal: colorVal,
              textPosLeft: textPosLeft,
              textPosTop: textPosTop,
              processed_linesArray: processed_lines 
            });
      
}

 function onTextDraw(data){
        var w = canvaso.width;
        var h = canvaso.height;
        DrawText(data.fsize, data.ffamily, data.colorVal, data.textPosLeft, data.textPosTop, data.processed_linesArray);
    }
    
    socket.on('textdraw', onTextDraw);
    


tools.text = function () {
    var tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    
    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    
    };

    this.mousemove = function (ev) {
        if (!tool.started) {
        return;
      }
        
        var x = Math.min(ev._x, tool.x0);
        var y = Math.min(ev._y, tool.y0);
        var width = Math.abs(ev._x - tool.x0);
        var height = Math.abs(ev._y - tool.y0);
         
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = width + 'px';
        textarea.style.height = height + 'px';
         
        textarea.style.display = 'block';
        textarea.style.color = "#"+colorPicked;
        textarea.style.font = SelectedFontSize+'px' + ' ' + SelectedFontFamily;
    };

    this.mouseup = function (ev) {
          if (tool.started) {
              
                //start      
                var lines = textarea.value.split('\n');
                var processed_lines = [];
                
                for (var i = 0; i < lines.length; i++) {
                    var chars = lines[i].length;
             
                        for (var j = 0; j < chars; j++) {
                            var text_node = document.createTextNode(lines[i][j]);
                            tmp_txt_ctn.appendChild(text_node);
                             
                            // Since tmp_txt_ctn is not taking any space
                            // in layout due to display: none, we gotta
                            // make it take some space, while keeping it
                            // hidden/invisible and then get dimensions
                            tmp_txt_ctn.style.position   = 'absolute';
                            tmp_txt_ctn.style.visibility = 'hidden';
                            tmp_txt_ctn.style.display    = 'block';
                             
                            var width = tmp_txt_ctn.offsetWidth;
                            var height = tmp_txt_ctn.offsetHeight;
                             
                            tmp_txt_ctn.style.position   = '';
                            tmp_txt_ctn.style.visibility = '';
                            tmp_txt_ctn.style.display    = 'none';
                             
                            // Logix
                             //console.log(width, parseInt(textarea.style.width));
                            if (width > parseInt(textarea.style.width)) {
                                break;
                            }
                        }
                     
                    processed_lines.push(tmp_txt_ctn.textContent);
                    tmp_txt_ctn.innerHTML = '';
                }
                
                /*var ta_comp_style = getComputedStyle(textarea);
                var fs = ta_comp_style.getPropertyValue('font-size');
                var ff = ta_comp_style.getPropertyValue('font-family');*/
                var fs = SelectedFontSize + "px";
                var ff = SelectedFontFamily;

                /*context.font = fs + ' ' + ff;
                context.textBaseline = 'top';
                context.fillStyle = "#"+colorPicked;
                 
                for (var n = 0; n < processed_lines.length; n++) {
                    var processed_line = processed_lines[n];
                     
                    context.fillText(
                        processed_line,
                        parseInt(textarea.style.left),
                        parseInt(textarea.style.top) + n*parseInt(fs)
                    );
                }
                
                img_update(); */
                
                DrawText(fs, ff, colorPicked, textarea.style.left, textarea.style.top, processed_lines, true)
                console.log("lines saved")
                textarea.style.display = 'none';
                textarea.value = '';
                          
            //end
                      
            tool.mousemove(ev);
            tool.started = false;
            
          }
    };
    
  };
  
  //Text tool end
  
  function clearAll_update(trans) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    contexto.clearRect(0, 0, canvaso.width, canvaso.height);
      
        if (!trans) { return; }

        socket.emit('Clearboard', {
          CleardrawingBoard: true
        });
  }
  
   function onClearAll(data){
            clearAll_update();
    }
  
  socket.on('Clearboard', onClearAll);

  
$("#clear-all").click(function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    contexto.clearRect(0, 0, canvaso.width, canvaso.height);
    clearAll_update(true)
});


  init();
  
    

}, false); }



//end


})();


