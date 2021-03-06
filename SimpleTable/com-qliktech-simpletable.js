define(["jquery", "text!./simpletable.css"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							translation : "Initial fetch rows",
							type : "number",
							defaultValue : 50
						},
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element) {
			var html = "<table><thead><tr>", self = this, lastrow = 0, morebutton = false;
			//render titles
			$.each(this.backendApi.getDimensionInfos(), function(key, value) {
				html += '<th>' + value.qFallbackTitle + '</th>';
			});
			$.each(this.backendApi.getMeasureInfos(), function(key, value) {
				html += '<th>' + value.qFallbackTitle + '</th>';
			});
			html += "</tr></thead><tbody>";
			//render data
			this.backendApi.eachDataRow(function(rownum, row) {
				lastrow = rownum;
				html += '<tr>';
				$.each(row, function(key, cell) {
					if(cell.qIsOtherCell) {
						cell.qText = self.backendApi.getDimensionInfos()[key].othersLabel;
					}
					html += '<td';
					if(!isNaN(cell.qNum)) {
						html += " class='numeric'";
					}
					html += '>' + cell.qText + '</td>';
				});
				html += '</tr>';
			});
			html += "</tbody></table>";
			//add 'more...' button
			if(this.backendApi.getRowCount() > lastrow + 1) {
				html += "<button id='more'>More...</button>";
				morebutton = true;
			}
			$element.html(html);
			if(morebutton) {
				var requestPage = [{
					qTop : lastrow + 1,
					qLeft : 0,
					qWidth : 10, //should be # of columns
					qHeight : Math.min(50, this.backendApi.getRowCount() - lastrow)
				}];
				$element.find("#more").on("qv-activate", function() {
					self.backendApi.getData(requestPage).then(function(dataPages) {
						self.paint($element);
					});
				});
			}
		}
	};
});