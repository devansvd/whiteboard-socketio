 var textarea = document.createElement('textarea');
textarea.id = 'text_tool';
container.appendChild(textarea);

// Text tool's text container for calculating
// lines/chars
var tmp_txt_ctn = document.createElement('div');
tmp_txt_ctn.style.display = 'none';
container.appendChild(tmp_txt_ctn);


var onPaint = function(ev_x, ev_y, tool_x0, tool_y0) {
		
		 context.clearRect(0, 0, canvas.width, canvas.height); 
      
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
    
    function saveText(){
        var lines = textarea.value.split('\n');
        var processed_lines = [];
        console.log("lines saved")
        
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
        
        var ta_comp_style = getComputedStyle(textarea);
        var fs = ta_comp_style.getPropertyValue('font-size');
        var ff = ta_comp_style.getPropertyValue('font-family');
         
        context.font = fs + ' ' + ff;
        context.textBaseline = 'top';
         
        for (var n = 0; n < processed_lines.length; n++) {
            var processed_line = processed_lines[n];
             
            context.fillText(
                processed_line,
                parseInt(textarea.style.left),
                parseInt(textarea.style.top) + n*parseInt(fs)
            );
        }
    }
    
  tools.text = function () {
    var tool = this;
    this.started = false;
    this.textInsert;
    
    this.mousedown = function (ev) {
        //Special case for text tool
        
       
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
      
    };

    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      
       context.clearRect(0, 0, canvas.width, canvas.height);
       
       /*
        context.clearRect(0, 0, canvas.width, canvas.height); 
      
        var x = Math.min(ev._x, tool.x0);
        var y = Math.min(ev._y, tool.y0);
        var width = Math.abs(ev._x - tool.x0);
        var height = Math.abs(ev._y - tool.y0);
         
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = width + 'px';
        textarea.style.height = height + 'px';
         
        textarea.style.display = 'block';
       
        */
       onPaint(ev._x, ev._y, tool.x0, tool.y0);
        saveText();
        

    };

    this.mouseup = function (ev) {
      if (tool.started) {
          
        tool.mousemove(ev);
        tool.started = false;
        tool.textInsert = true;
        //img_update(true);
         img_update();
        //textarea.style.display = 'none';
        //textarea.value = '';

      }
    };
    
  };
