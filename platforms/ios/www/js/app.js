// Author: Steve Haskins
var img, context, imageURI64;
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
        
        // override form submit, so "go" button on keyboard adds text just like set text button
        
       $('#captionForm').submit(function(ev) {
           ev.preventDefault();
           app.insertCaption();
           $('#textbox').blur();
       });
        
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
        
        // listener for text button
        
        var textbox = document.getElementById('changeText');
        var textboxHammer = new Hammer(textbox);
        textboxHammer.on("tap", app.insertCaption);
        
        // listener for save button
        var saveButton = document.getElementById('saveButton');
        var saveButtonHammer = new Hammer(saveButton);
        saveButtonHammer.on("tap", app.saveImages);
        
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
          targetHeight: 400,
          cameraDirection: Camera.Direction.BACK,
          saveToPhotoAlbum: false,
            correctOrientation: true
              
        };
      
        navigator.camera.getPicture(onSuccess, onFail, opts);

function onSuccess(imageURI) {
     imageURI64 = imageURI;

   // var canvas = document.createElement("canvas");
//    var outputDiv = document.createElement("div");
 //   outputDiv.setAttribute("id", "output");
//    canvas.setAttribute("width", 400);
//    canvas.setAttribute("height", 400);

    var canvas = document.getElementById("canvasID");
    //took var out here
     context = canvas.getContext('2d');

    
//    document.body.appendChild(canvas);
//    document.body.appendChild(outputDiv);
    
    //took the var out here
     img = document.createElement("img");
   img.onload = function() {
       // changed this
    context.drawImage(img, 0, 0, 720, 400);
  };
  img.src = imageURI64;
    
    
    
    
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
    
// grid page starts here

    
    openGridPage: function(){
        
        
        var deviceID = device.uuid;
       
       // var deviceID = "b24fabf8f46a667b";
       

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
//            url: "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php",
            url: "http://m.edumedia.ca/hask0023/mad9022/list.php",
            type:"GET",
            //dataType: 'text',
            dataType: 'text',
            data: {dev:deviceID},
            success: function(data)
            {
              // create the grid of images
                
                var rawData = data;
                var parsed = JSON.parse(rawData);
                var length = parsed.thumbnails.length;
              
                
                for (var i=0; i<length; i++){
                
                var createListItem = document.createElement("li");
                createListItem.setAttribute("data-ref", imageID);
                var imageID = parsed.thumbnails[i].id;
                var imageData = parsed.thumbnails[i].data;
                    
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
            var deviceID = device.uuid;
             var imageID = ev.target.getAttribute("data-ref");
            $.ajax({

                 url: "http://m.edumedia.ca/hask0023/mad9022/get.php",
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
        var deviceID = device.uuid;
//        var imageID = 0;
           //  var deviceID = "b24fabf8f46a667b";
             var imageID = ev.target.getAttribute("data-ref");
            $.ajax({
            url: "http://faculty.edumedia.ca/griffis/mad9022/final-w15/delete.php",
            type:"GET",
            dataType: 'text',
            data: {dev:deviceID, img_id:imageID},
            success: function(data)
            {
                // fill src of the modal image
             console.log("Pic Deleted");
                app.openGridPage();
                
            }
        });
            
        alert ("delete confirmed");
       
        
    }
    
    
    }
    },
        // called when you tap anywhere on the overlay, goes back to the grid screen
    closeModal: function () {
         document.querySelector("[data-role=overlay]").style.display="none";
         document.getElementById("fullImage").style.display="none";
        
    },
    
    // function to insert captions
    insertCaption: function (){

    var topText = document.getElementById('topRadio');
    var bottomText = document.getElementById('bottomRadio');
    var insertText = document.getElementById('textbox').value;
    var canvas = document.getElementById('canvasID');
    
    
        if (insertText != ""){
        
            if(topText.checked){
                
           context.clearRect(0, 0, canvas.w, canvas.h );
                
            var w = img.width;
            var h = img.height;
            context.drawImage(img, 0, 0, w, h);
                
//                var middle = 300;
//                var top = 100;
                 var middle = canvas.width / 2;
                var top = canvas.height - 300;
                context.font = "30px sans-serif";
                context.fillStyle = "red";
                context.strokeStyle = "gold";
                context.textAlign = "center";
                context.fillText(insertText, middle, top);
                context.strokeText(insertText,middle,top);
            }
        
        else if (bottomText.checked) {
                 context.clearRect(0, 0, canvas.w, canvas.h );
                
            var w = img.width;
            var h = img.height;
            context.drawImage(img, 0, 0, w, h);
                
                var middle = canvas.width / 2;
                var top = canvas.height - 30;
                context.font = "30px sans-serif";
                context.fillStyle = "red";
                context.strokeStyle = "gold";
                context.textAlign = "center";
                context.fillText(insertText, middle, top);
                context.strokeText(insertText,middle,top);
            
            
            
            }
            
            }
            
                
            
        
        },
     // save images function
    saveImages: function(){
        var deviceID = device.uuid;
        var originalCanvas = document.getElementById('canvasID');
        var bigImage = originalCanvas.toDataURL();
        
        
        var imgWidth = img.width;
        var imgHeight = img.height;
        var aspectRatio = imgWidth / imgHeight;
       alert ("hello");

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
        
        canvas.width = 180;
        canvas.length = 100;
        
        ctx.drawImage(img, 0, 0, 180, 100);
        
        var thumbnail = canvas.toDataURL();
        
//        alert(deviceID);    
//       alert (thumbnail);
//        alert (bigImage);
        
        
        
         $.ajax({

            url: "http://m.edumedia.ca/hask0023/mad9022/save.php",
            type:"POST",
            dataType: 'text',
            data: {dev:deviceID, img:bigImage, thumb:thumbnail},
            success: function(data)
            {
                // fill src of the modal image
               alert ("uploaded image?");
                
            }
        });   
            
        
          
    }
      
    
    
    }
    
    

    
   
    
//}

app.init();