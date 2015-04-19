// Author: Steve Haskins

var app= {
	loadRequirements:0,
	init: function(){
        // comment this back in to test on emulator
		document.addEventListener("deviceready", app.onDeviceReady);
		document.addEventListener("DOMContentLoaded", app.onDomReady);
	},
	onDeviceReady: function(){
		app.loadRequirements++;
		if(app.loadRequirements === 2){
			app.start();
		}
	},
	onDomReady: function(){
		app.loadRequirements++;
		if(app.loadRequirements === 2){ // change this back to 2 when using emulator
			app.start();
		}
	},
	start: function(){
	     //alert ("In start function");  
            app.openGridPage();
    // listeners for the nav menu    
        var navBarCam = document.getElementById('navCamId');
        var addNavBarCamHammer = new Hammer(navBarCam);
        addNavBarCamHammer.on("tap", app.openCamPage);
        
        var navBarGrid = document.getElementById('navGridId');
        var addNavBarGridHammer = new Hammer(navBarGrid);
        addNavBarGridHammer.on("tap", app.openGridPage);
        
   //  listener for the UL on the grid screen
        
        var gridList = document.getElementById('gridList');
        var addGridListHammer = new Hammer(gridList);
        addGridListHammer.on("tap", app.openModal);
        

    // listener on overlay to close the modal screen
        
       var overlay = document.querySelector("[data-role=overlay]");
        var overlayHammer = new Hammer(overlay);
        overlayHammer.on("tap", app.closeModal);
	},
    
    openCamPage: function(ev){
        
        var opts = {
          quality: 75,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
         // allowEdit: true,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          targetWidth: 720,
          targetHeight: 480,
          cameraDirection: Camera.Direction.BACK,
          saveToPhotoAlbum: false,
            correctOrientation: true
              
        };
      
        navigator.camera.getPicture(onSuccess, onFail, opts);

function onSuccess(imageURI) {
    var imageURI = imageURI;

   // var canvas = document.createElement("canvas");
//    var outputDiv = document.createElement("div");
 //   outputDiv.setAttribute("id", "output");
//    canvas.setAttribute("width", 400);
//    canvas.setAttribute("height", 400);

    var canvas = document.getElementById("canvasID");
    var context = canvas.getContext('2d');

    
//    document.body.appendChild(canvas);
//    document.body.appendChild(outputDiv);
    
    var img = document.createElement("img");
   img.onload = function() {
    context.drawImage(img, 0, 0);
  };
  img.src = imageURI;
    
    
    
    
}

function onFail(message) {
   // alert('Failed because: ' + message);
}
       
        var activeTab = document.getElementById('camPageLink');
        var inactiveTab = document.getElementById('gridPageLink');
        var activePage = document.getElementById('takePhotoScreen');
        var hiddenPage = document.getElementById('gridScreen');
        activeTab.className="activetab";
        inactiveTab.className = "";
        activePage.className = "active";
        hiddenPage.className = "hidden";
        
        
        
    },
    
    openGridPage: function(){
        
        
       // var deviceID = device.uuid;
        var deviceID = "b24fabf8f46a667b";
       
       
        var activeTab = document.getElementById('gridPageLink');
        var inactiveTab = document.getElementById('camPageLink');
        var activePage = document.getElementById('gridScreen');
        var hiddenPage = document.getElementById('takePhotoScreen');
        activeTab.className = "activetab";
        inactiveTab.className = "";
        activePage.className = "active";
        hiddenPage.className = "hidden";
        
        //empty out the grid of images before building it again
        var root = document.getElementById("gridList");
        while( root.firstChild ){
      root.removeChild( root.firstChild );
        }
        
       
        
       
      //  console.log (url);
        $.ajax({
            url: "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php",
            type:"GET",
            dataType: 'text',
            data: {dev:deviceID},
            success: function(data)
            {
              // create the grid of images
                
                var rawData = data;
                var parsed = JSON.parse(rawData);
                var length = parsed.thumnbails.length;
              
                
                for (var i=0; i<length; i++){
                
                var createListItem = document.createElement("li");
                createListItem.setAttribute("data-ref", imageID);
                var imageID = parsed.thumnbails[i].id;
                var imageData = parsed.thumnbails[i].data;
                    
                var createImage = document.createElement("img");
                createImage.setAttribute("src", imageData);    
                createImage.setAttribute("data-ref", imageID);
                createImage.setAttribute("class", "thumbPic"); 
                    
                var createDelButton = document.createElement("button");  
                createDelButton.setAttribute("type", "button");
                createDelButton.setAttribute("class", "delButton");
                createDelButton.setAttribute("data-ref", imageID);
                    
                var buttonText = document.createTextNode("Delete");
                createDelButton.appendChild(buttonText);
                
                createListItem.appendChild(createImage);
                createListItem.appendChild(createDelButton);    
                
                document.getElementById("gridList").appendChild(createListItem);
                    
                    
                
            }

                
                
            }
        });
      
        
        
    },
    // when you click on a thumbnail, bring up modal with big picture. If you click delete button, get confirmation.
    openModal: function(ev){
       
         // if the click target is the image
        if (ev.target.hasAttribute("src")){
            document.querySelector("[data-role=overlay]").style.display="block";
            document.getElementById("fullImage").style.display="block";
             var deviceID = "b24fabf8f46a667b";
             var imageID = ev.target.getAttribute("data-ref");
            $.ajax({
            url: "http://faculty.edumedia.ca/griffis/mad9022/final-w15/get.php",
            type:"GET",
            dataType: 'text',
            data: {dev:deviceID, img_id:imageID},
            success: function(data)
            {
                // fill src of the modal image
                var rawData = data;
                var parsed = JSON.parse(rawData);
              
                
                var bigImage = document.getElementById("bigImage");
                bigImage.setAttribute("src", parsed.data);
                
            }
        });
            
            }
        // when they click the delete button below the thumbnail, pop up confirmation dialogue
    else if (ev.target.hasAttribute("type")) {
        
        confirmDelete();
    }
            
            function confirmDelete() {
                 navigator.notification.confirm(
        "Are you sure you want to delete this image?", 
        function( index ) {
            switch ( index ) {
                case 1:
                    //the first button was pressed. Delete photo from database and interface
                    deletePhoto();
    
                    
                    break;
                  
                case 2:
                    // the second button was pressed, do nothing
                    break;
            }
                
            },
        "Delete Image",
        [ "Yes", "No"]
    );
            // delete selected photo
        function deletePhoto()
    {
//        var deviceID = device.uuid;
//        var imageID = 0;
        alert ("delete confirmed");
       
        
    }
    
    
    }
    },
        // called when you tap anywhere on the overlay, goes back to the grid screen
    closeModal: function () {
         document.querySelector("[data-role=overlay]").style.display="none";
         document.getElementById("fullImage").style.display="none";
        
    }
    

    
   
    
}

app.init();