(function(){

var ui = angular.module('axelor.ui');

ui.formInput('Image', {
	
	css: 'image-item',
	cellCss: 'form-item image-item',
	
	BLANK: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",

	link_editable: function(scope, element, attrs, model) {
		
		var input = element.children('input:first');
		var image = element.children('img:first');
		var buttons = element.children('.btn-group');
		var BLANK = this.BLANK;
		
		input.add(buttons).hide();
		image.add(buttons).hover(function(){
			buttons.show();
		}, function() {
			buttons.hide();
		});

		scope.doSelect = function() {
			input.click();
		};
		
		scope.doSave = function() {
			var content = image.get(0).src;
			if (content) {
				window.open(content);
			}
		};
		
		scope.doRemove = function() {
			image.get(0).src = BLANK;
			image.get(0).src = null;
			input.val(null);
			update(null);
		};
		
		input.change(function(e, ui) {
			var file = input.get(0).files[0];
			var reader = new FileReader();
			
			reader.onload = function(e){
				var content = e.target.result;
				image.get(0).src = content;
				update(content);
			};

			reader.readAsDataURL(file);
		});
		
		function update(value) {
			setTimeout(function(){
				model.$setViewValue(value);
				scope.$apply();
			});
		}

		scope.$render_editable = function() {
			var content = model.$viewValue || null;
			if (content == null) {
				image.get(0).src = BLANK;
			}
			image.get(0).src = content;
		};
	},
	link_readonly: function(scope, element, attrs, model) {

		var BLANK = this.BLANK;
		var image = element.children('img:first');
		
		scope.$render_readonly = function() {
			var content = model.$viewValue || null;
			if (content == null) {
				image.get(0).src = BLANK;
			}
			image.get(0).src = content;
		};
	},
	template_editable:
	'<div style="min-width: 140px;">' +
		'<input type="file" accept="image/*">' +
		'<img class="img-polaroid" style="width: 140px; height: 140px; display: inline-block;">' +
		'<div class="btn-group">' +
			'<button ng-click="doSelect()" class="btn" type="button"><i class="icon-upload-alt"></i></button>' +
			'<button ng-click="doSave()" class="btn" type="button"><i class="icon-download-alt"></i></button>' +
			'<button ng-click="doRemove()" class="btn" type="button"><i class="icon-remove"></i></button>' +
		'</div>' +
	'</div>',
	
	template_readonly:
	'<div style="min-width: 140px;">'+
		'<img class="img-polaroid" style="width: 140px; height: 140px;">'+
	'</div>'
});

ui.formInput('Binary', {
	
	css: 'file-item',
	cellCss: 'form-item file-item',
	
	link_editable: function(scope, element, attrs, model) {
		
		var input = element.children('input:first').hide();
		var frame = element.children("iframe").hide();

		scope.doSelect = function() {
			input.click();
		};
		
		scope.doSave = function() {
			var record = scope.record,
				model = scope._model,
				field = element.attr('x-field');
			var url = "ws/rest/" + model + "/" + record.id + "/" + field + "/download";
			frame.attr("src", url);
			setTimeout(function(){
				frame.attr("src", "");
			},100);
		};
		
		scope.doRemove = function() {
			var record = scope.record;
			input.val(null);
			model.$setViewValue(null);
			record.$upload = null;
		};

		input.change(function(e) {
			var file = input.get(0).files[0];
			var record = scope.record;
			if (file) {
				record.$upload = {
					field: element.attr('x-field'),
					file: file
				};
				//Update file and mine just in case of new record
				if(!record.id && scope._model == 'com.axelor.meta.db.MetaFile'){
					record.fileName = file.name;
					record.mine = file.type;
				}
				record.size = file.size;
				setTimeout(function(){
					model.$setViewValue(0); // mark form for save
					scope.$apply();
				});
			}
		});
		
	},
	template_editable:
	'<div>' +
		'<iframe></iframe>' +
		'<input type="file">' +
		'<div class="btn-group">' +
			'<button ng-click="doSelect()" class="btn" type="button"><i class="icon-upload-alt"></i></button>' +
			'<button ng-click="doSave()" class="btn" type="button"><i class="icon-download-alt"></i></button>' +
			'<button ng-click="doRemove()" class="btn" type="button"><i class="icon-remove"></i></button>' +
		'</div>' +
	'</div>'
});

})(this);
