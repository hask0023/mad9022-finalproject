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
       // ev.preventDefault();
      //  ev.target.className = "activetab";
       
        var activeTab = document.getElementById('gridPageLink');
        var inactiveTab = document.getElementById('camPageLink');
        var activePage = document.getElementById('gridScreen');
        var hiddenPage = document.getElementById('takePhotoScreen');
        activeTab.className = "activetab";
        inactiveTab.className = "";
        activePage.className = "active";
        hiddenPage.className = "hidden";
        
    }
}

app.init();