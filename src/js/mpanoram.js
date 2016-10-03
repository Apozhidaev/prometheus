/**
 * MPanoram v2
 * www.mikeo.ru
 */

var imagesExtentions = "jpg gif png bmp tiff";
var flashExtentions = "swf fla";
var multimediaFileExtensions = imagesExtentions+' '+flashExtentions;

/**
 * Get the page and viewport size
 * @return {Array}
 */
function getPageSize(){
	var xScroll, yScroll, windowWidth, windowHeight, b = document.body, de = document.documentElement;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = b.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (b.scrollHeight > b.offsetHeight){ // all but Explorer Mac
		xScroll = b.scrollWidth;
		yScroll = b.scrollHeight;
	} else if (de && de.scrollHeight > de.offsetHeight){ // Explorer 6 strict mode
		xScroll = de.scrollWidth;
		yScroll = de.scrollHeight;
	} else { // Explorer Mac...would also work in Mozilla and Safari
		xScroll = b.offsetWidth;
		yScroll = b.offsetHeight;
	}

	if (self.innerHeight) { // all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (de && de.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = de.clientWidth;
		windowHeight = de.clientHeight;
	} else if (b) { // other Explorers
		windowWidth = b.clientWidth;
		windowHeight = b.clientHeight;
	}

	// for small pages with total height less then height of the viewport
	var pageHeight = yScroll < windowHeight? windowHeight : yScroll;

	// for small pages with total width less then width of the viewport
	var pageWidth = xScroll < windowWidth? windowWidth : xScroll;

	return [pageWidth,pageHeight,windowWidth,windowHeight]
}

/**
 * Get coords of scroll bars
 * @return {Array} - [coord horizontal, coord vertical]
 */
function getScrollXY() {
	var scrOfX = 0, scrOfY = 0, b = document.body, de = document.documentElement;
	if( typeof( window.pageYOffset ) == 'number' ) {
		//Netscape compliant
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	} else if( b && ( b.scrollLeft || b.scrollTop ) ) {
		//DOM compliant
		scrOfY = b.scrollTop;
		scrOfX = b.scrollLeft;
	} else if( de && ( de.scrollLeft || de.scrollTop ) ) {
		//IE6 Strict
		scrOfY = de.scrollTop;
		scrOfX = de.scrollLeft;
	}
	return [ scrOfX, scrOfY ];
}

function hidePanoramBox() {
//	document.body.scroll = 'auto';
//	разрешаем скроллинг
//	document.body.style.overflow = 'auto';
	document.getElementById("containerOver").style.display = 'none';
	document.getElementById("panoramBox").style.display = 'none';
}

function showPanoramBox(url,header,footer) {
	 
	var str = '';

	if (!document.getElementById("panoramBox")) {
		var str2 = document.body.innerHTML;
		document.body.innerHTML = '<div id="containerOver">&nbsp;</div><div id="panoramBox">&nbsp;</div>'+str2;
		str2 = '';
	}

	if (imagesExtentions.indexOf(getFileExtension(url)) != -1) {
	    var str='\
    <table width="100%" height="100%"><td align="center" valign="center"><table id="win">\
		<td width="1%" height="1%">\
       		<a href="javascript:" onclick="return hidePanoramBox();" title="Закрыть"><div id="panoramBoxCloseButton"></div></a>\
        	<h2 id="panoramBoxHeader">'+header+'</h2>\
        	<div id="panoramBoxContent">\
	      		<a href="javascript:" onclick="return hidePanoramBox();" title="Закрыть"><img id="panoramBoxImg" src="'+url+'" onload="this.style.visibility=\'visible\'" align="left"></a>\
            </div>\
            <div id="panoramBoxFooter">'+footer+'</div>\
		</td>\
	</table></td></table>\
	    ';
	}

	if (flashExtentions.indexOf(getFileExtension(url)) != -1) {
	    var str='\
    <table width="100%" height="100%"><td align="center" valign="center"><table id="win">\
		<td width="1%" height="1%">\
       		<a href="javascript:" onclick="return hidePanoramBox();" title="Закрыть"><div id="panoramBoxCloseButton"></div></a>\
        	<h2 id="panoramBoxHeader">'+header+'</h2>\
        	<br clear="all">\
        	<div id="panoramBoxContent">\
                <object id="panoramBoxObject" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0">\
                    <param name="movie" value="'+url+'">\
                    <embed id="panoramBoxEmbed" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="'+url+'" wmode="transparent">\
                </object>\
            </div>\
            <div id="panoramBoxFooter">'+footer+'</div>\
		</td>\
	</table></td></table>\
    	';
	}	

	if (str!='') {
    	document.getElementById("panoramBox").innerHTML = str;

//	запрещаем скроллинг
//	document.body.scroll = 'no';
//	scrollPosX = getScrollXY()[0]-10;
//	scrollPosY = getScrollXY()[1];

//	document.getElementById("containerOver").style.width = getPageSize()[0];
	document.getElementById("containerOver").style.height = getPageSize()[1]+'px';
	document.getElementById("containerOver").style.display = 'inline';

    document.getElementById("panoramBox").style.marginTop = getScrollXY()[1]+'px';
	document.getElementById("panoramBox").style.display = 'inline';

//	запрещаем скроллинг
//	document.body.style.overflow = 'hidden'; 
//  window.scrollTo(scrollPosX, scrollPosY);
		return false;
	}
}

function getFileExtension(filename) { 
	if( filename.length == 0 ) return ""; 
	var dot = filename.lastIndexOf("."); 
	if( dot == -1 ) return ""; 
	var extension = filename.substr(dot+1,filename.length); 
	return extension.toLowerCase(); 
} 

function isMultimediaFileExtension(extension) {
	if (extension == '' || multimediaFileExtensions.indexOf(extension) == -1) return false;
	return true; 
}

document.onclick = function(event) {

	event = event || window.event;
	
	var t = event.target || event.srcElement;

	var t_title = t.title;
	var t_alt = t.alt;

	while (t.tagName!='A'&&t.parentNode.tagName!='HTML') {
		t = t.parentNode;
	}
	var t_href = t.getAttribute("href",2);
	if (t_href && isMultimediaFileExtension(getFileExtension(t_href))) {
//	if (t_href) {

			if (t.getAttribute("onclick",2)) {
				t.removeAttribute("onclick");					
			}

        	if (!t_alt) {
        		t_alt = '';
	        }

			if (!t_title) {
				t_title = t_alt;
			}
			if (t_title == t_alt) {
				t_alt = '';
			}

			showPanoramBox(t_href,t_title,t_alt);
		 	return false;
	}
}

