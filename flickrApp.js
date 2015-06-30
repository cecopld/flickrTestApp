var flickrObj = {};

(function(){
	flickrObj.tags = 'london';
	flickrObj.methods = {
		includeScriptTag: function () {
			var script=document.createElement('script');
			script.src='https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickrObj.methods.init&tags='+flickrObj.tags;
			document.head.appendChild(script);
		},
	
		init: function (data) {
			var dataPhotos = flickrObj.methods.addIsSelectedProperty(data.items);
			flickrObj.methods.getFromStorage();	
			flickrObj.photos = flickrObj.photos || dataPhotos;
			if (!flickrObj.photos.length) return false // early out
			flickrObj.methods.initKnockoutJs();
		},
		
		addIsSelectedProperty: function (dataPhotos) {
			for (index = 0; index < dataPhotos.length; ++index) {
				dataPhotos[index].isSelected = false;
			}
			return dataPhotos;
		},
		
		initKnockoutJs: function () {
			flickrObj.model = new VM();
			ko.applyBindings(flickrObj.model);
			flickrObj.model.loading(false);
		},
		
		preparePhotos: function () {
			flickrObj.methods.getInStorage();
		},
		
		saveInStorage: function (photosObj) {
			if(typeof(Storage) !== "undefined") {
				// Code for localStorage/sessionStorage.
				localStorage.setItem("photos",JSON.stringify(photosObj));
			
			} else {
				// Sorry! No Web Storage support..
				alert("no local storage");
			}
		},
		
		getFromStorage: function () {
			if(typeof(Storage) !== "undefined") {
				// Code for localStorage/sessionStorage.
				flickrObj.photos = JSON.parse(localStorage.getItem("photos"));
			} else {
				// Sorry! No Web Storage support..
				alert("no local storage");
			}
		}
	}
	
	flickrObj.methods.includeScriptTag();

})();

function VM () {
	var self = this;
	self.loading = ko.observable(true);
    self.photos = ko.mapping.fromJS(flickrObj.photos);
	self.photoClicked = function (photo) {
		photo.isSelected(!photo.isSelected());
		flickrObj.photos = ko.toJS(self.photos());
		flickrObj.methods.saveInStorage(flickrObj.photos);
	}
}