// Steve Haskins - javascript part

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
            
    // listeners for the nav menu    
        var navBarCam = document.getElementById('navCamId');
        var addNavBarCamHammer = new Hammer(navBarCam);
        addNavBarCamHammer.on("tap", app.openCamPage);
        
        var navBarGrid = document.getElementById('navGridId');
        var addNavBarGridHammer = new Hammer(navBarGrid);
        addNavBarGridHammer.on("tap", app.openGridPage);
        
   //  listener for the UL list on the grid screen
        
        var gridList = document.getElementById('gridList');
        var addGridListHammer = new Hammer(gridList);
        addGridListHammer.on("tap", app.openModal);
        
    // listener for the delete buttons on the grid
//        var deleteImageButton = document.getElementById('deleteImage');
//        var deleteImageButtonHammer = new Hammer(deleteImageButton);
//        deleteImageButtonHammer.on("tap", app.confirmDelete);
        
       var overlay = document.querySelector("[data-role=overlay]");
        var overlayHammer = new Hammer(overlay);
        overlayHammer.on("tap", app.closeModal);
	},
    
    openCamPage: function(ev){
       // ev.preventDefault();
       
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
        // all of the hiding/showing stuff
       
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
                var rawData = data;
                var parsed = JSON.parse(rawData);
                var length = parsed.thumnbails.length;
               // var value = parsed.thumnbails[0].id;
                console.log (length);
                
                for (var i=0; i<length; i++){
                
                var createListItem = document.createElement("li");
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
        var gridImages = document.querySelectorAll(".thumbPic");
        console.log(gridImages.length);
        for (var i=0; i<gridImages.length; i++){
            
        var gridImageHammer = new Hammer(gridImages[i]);
        gridImageHammer.on("tap", app.openModal);
        }
        
        // listeners for the delete buttons
        var delButtons = document.querySelectorAll(".delButton");
        for (var i=0; i<delButtons.length; i++){
            
        var delButtonHammer = new Hammer(delButtons[i]);
        delButtonHammer.on("tap", app.confirmDelete);
        }
            }
        });
        // listeners for the images
        
        
        
        
//        var gridRequest = new XMLHttpRequest();
//        gridRequest.open("GET", "list.php?dev=" + deviceID, false);
//        gridRequest.send();
//        var listJSON = gridRequest.responseText;
//        console.log(gridRequest);
        
        
    },
    // when you click on a thumbnail, bring up modal with big picture. If you click delete button, get confirmation.
    openModal: function(ev){
        //ajax for full size
        
        if (ev.target.hasAttribute("src")){
            document.querySelector("[data-role=overlay]").style.display="block";
            document.getElementById("fullImage").style.display="block";
             var deviceID = "b24fabf8f46a667b";
             var imageID = ev.target.getAttribute("data-ref");
           //  var imageData = parsed.thumnbails[i].data;
            $.ajax({
            url: "http://faculty.edumedia.ca/griffis/mad9022/final-w15/get.php",
            type:"GET",
            dataType: 'text',
            data: {dev:deviceID, img_id:imageID},
            success: function(data)
            {
            
                var rawData = data;
                var parsed = JSON.parse(rawData);
               // console.log (parsed.data);
                
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
            
        function deletePhoto()
    {
        var deviceID = device.uuid;
        var imageID = 0;
         // open database 
        xmlhttp.open("GET", "db.inc.php", true);
        xmlhttp.send(); 
        // delete from database
        xmlhttp.open("GET", "delete.php?dev=" + deviceID + "&img_id=" + imageID, true);
        xmlhttp.send();
        
    }
    
    
    }
    },
    
    closeModal: function () {
         document.querySelector("[data-role=overlay]").style.display="none";
         document.getElementById("fullImage").style.display="none";
        
    }
    

    
   
    
}

app.init();