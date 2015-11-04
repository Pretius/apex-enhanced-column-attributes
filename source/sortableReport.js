console.log('APEX CHROME plugin loaded: sortableReport.js');

var isSorted = false;

var strings = {
  'moveTop': 'Move row to first position',
  'moveBottom': 'Move row to last position',
  'move': 'Move row with mouse'
};

var icon_move = '<a href="javascript: void(0);" title="'+strings.move+'" class="handle"><img src="'+chrome.extension.getURL('/img/move.gif')+'"></a>';
var icon_move_bottom = '<a href="javascript: void(0);" title="'+strings.moveBottom+'" class="move_bottom"><img src="'+chrome.extension.getURL('/img/move_bottom.gif')+'"></a>';
var icon_move_top = '<a href="javascript: void(0);" title="'+strings.moveTop+'" class="move_top"><img src="'+chrome.extension.getURL('/img/move_top.gif')+'"></a>';

/*

nie potrzebne bo wystarczylo nie zmieniac id inputów, dla których nagłówki są generowane statycznie do JS i podmiana wartosci naglowka jest z funkcji setHeadings

function check_heading_type(event) {
  var self = $(this);
  
  if (self.data('force_save'))
    alert(1);
    
  event.stopPropagation();
}

function block_heading_type(){
  $('[id*=P420_PLUG_QUERY_HEADINGS_TYPE]').data('force_save', true);
}
*/

function moveTop() {
  var self = $(this);
  var tr = self.parents('tr:first');
  var parent = tr.parent();
  
  var tr_copy = tr.clone();
  parent.find('tr:has(th)').after(tr_copy);
  tr.remove();
  setPasteFromExcel(report);
  resetIndex()
}

function moveBottom() {
  var self = $(this);
  var tr = self.parents('tr:first');
  var parent = tr.parent();
  
  var tr_copy = tr.clone();
  //wstaw 
  parent.append(tr_copy);
  tr.remove();
  //odśwież ustawienia
  setPasteFromExcel(report);
  
  resetIndex();
}


function resetIndex() {
    
    var order_by = 1;
    
    report.find('tr:not(:has(th))').each( function(){
      var self = $(this);
      
      self.find('[name=f03],[name=f07], [name=f08], [name=f09]').val(order_by++);
    });
    
    /*
    order_by = 1;
    report.find('tr:not(:has(th)) [name=f04]').each(function(){
      $(this).attr('id', 'hd'+order_by++)
    });
    */

    //wymuś odświeżenie wklejania z excela
    //setPasteFromExcel(report);
    
    //block_heading_type();
}

function setSortableReport() {
  report.find('tr:has(td)').prepend('<td class="extenstion_column" style="width:80px">'+icon_move_bottom+''+icon_move_top+''+icon_move+'</td>');
  report.find('tr:has(th)').prepend('<th> </th>');

  $( report ).delegate( ".move_top", "click", moveTop );
  $( report ).delegate( ".move_bottom", "click", moveBottom );

  report.find('td').each(function(){
    $(this).css('width', $(this).width() +'px');
  });

  report.find('tbody').sortable({
    "cursor": 'move',
    "revert": true,
    "forceHelperSize": true,
    "axis": "y",
    "handle": ".handle",
    
    stop: resetIndex
    
  });

}
