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