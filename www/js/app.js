// Steve Haskins - javascript part

var app= {
	loadRequirements:0,
	init: function(){
        // comment this back in to test on emulator
	//	document.addEventListener("deviceready", app.onDeviceReady);
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
		if(app.loadRequirements === 1){ // change this back to 2 when using emulator
			app.start();
		}
	},
	start: function(){
	
       
       
    // listeners for the nav menu    
        var navBarCam = document.getElementById('navCamId');
        var addNavBarCamHammer = new Hammer(navBarCam);
        addNavBarCamHammer.on("tap", app.openCamPage);
        
        var navBarGrid = document.getElementById('navGridId');
        var addNavBarGridHammer = new Hammer(navBarGrid);
        addNavBarGridHammer.on("tap", app.openGridPage);
        
    // listeners for the UL list on the grid screen
        
        var gridList = document.getElementById('gridList');
        var addGridListHammer = new Hammer(gridList);
        addGridListHammer.on("tap", app.openModal);
        
        // listener for the delete buttons on the grid
        var deleteImageButton = document.getElementById('deleteImage');
        var deleteImageButtonHammer = new Hammer(deleteImageButton);
        deleteImageButtonHammer.on("tap", app.confirmDelete);
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
    
    openGridPage: function(ev){
        
        // all of the hiding/showing stuff
       
        var activeTab = document.getElementById('gridPageLink');
        var inactiveTab = document.getElementById('camPageLink');
        var activePage = document.getElementById('gridScreen');
        var hiddenPage = document.getElementById('takePhotoScreen');
        activeTab.className = "activetab";
        inactiveTab.className = "";
        activePage.className = "active";
        hiddenPage.className = "hidden";
        
        
        // show the grid of images
        
        
    },
    // when you click on a thumbnail, bring up modal with big picture
    openModal: function(){

    
    
    },
    
    // when they click the delete button below the thumbnail, pop up confirmation dialogue
    confirmDelete: function(){
    navigator.notification.confirm(
        "Are you sure you want to delete this image?", 
        function( index ) {
            switch ( index ) {
                case 1:
                    //the first button was pressed
                    break;
                    app.deletePhoto;
                case 2:
                    // the second button was pressed
                    break;
            }
        },
        "Delete Image",
        [ "Yes", "No"]
    );
                    
    
    },
    // do AJAX call to delete photo from database, and delete from the interface
    deletePhoto: function(){
        
        
    }
    
}

app.init();