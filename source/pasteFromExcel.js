console.log('APEX CHROME plugin loaded: pasteFromExcel.js');

function setPasteFromExcel(report) {
  
  

  var isMSIE = /*@cc_on!@*/false;
  var table2d = null;
  var input = $(':input', report).not('input[type=checkbox]');
  if (isMSIE) {
    //ie
    input.bind('paste', function(){
    
      prepareExcel(report);
      
      table2d = getClipBoardAsArray2D(window.clipboardData.getData("Text"));
      pasteToTable3($(this),table2d);
      
      $(this).val(table2d[0][0]).trigger('change');
      return false;
    }).data(
      'excel', {
        'selector': report
      }
    );
  }
  else {
    //others
    input.catchpaste( function( paste, options ) {
    
      prepareExcel(report);
      
      table2d = getClipBoardAsArray2D(paste);
      pasteToTable3($(this),table2d);
      $(this).val('').trigger('change');
      return table2d[0][0];
    }).data(
      'excel', {
        'selector': report
      }
    );;
  }
}

/*
  selector STRING
    przykład: 'table[id=report_p20210_form]'
    zastosowanie: uchyt do tabeli w DOM, która wspiera wkljanie z excela
  
    

  prepareExcel('table[id=report_p20210_form]')
*/

function prepareExcel(selector) {
  var selector = $(selector);
  var table_to_matrix = []
  var tr_count = selector.find('tr').length;
  var td_count = selector.find('tr:not(:has(th))').first().find('td').length;

  for (var y=0; y < tr_count; y++) {
    if ( !$.isArray(table_to_matrix[y]) ) {
      table_to_matrix[y] = [];
    }
    for (var x=0; x < td_count; x++) {
      table_to_matrix[y][x] = null;
    }
  }

  $('tr',selector).each(function(){
    var tr = $(this);
    var tr_idx = tr.prevAll('tr').length;
    
    tr.find('th,td').each(function(){
      var tr_td_th = $(this);
      var td_th_idx = tr_td_th.prevAll('td,th').length;
      table_to_matrix[tr_idx][td_th_idx] = $(tr_td_th);
      
    })
  })

  selector.data(
    'excel', {
      matrix: table_to_matrix
    }
  );
}


function pasteToTable3(elem,array2D) {
  var self = $(elem);
  
  var elem_col_idx = self.parents('td').first().prevAll('td').length;
  var elem_row_idx = self.parents('tr').first().prevAll('tr').length;
  var table = $( self.data('excel').selector );
  var table_matrix = table.data('excel').matrix;
  
  var checkbox_flags = [
    1,
    '1', 
    'YES', 
    'Yes',    
    'TAK', 
    'Tak',     
    'T', 
    'Y'
  ];
  
  //console.log('rows: '+array2D.length);
  //console.log('cols: '+array2D[0].length);
  
  //iteruj po tablicy wartosci
  for (var y = 0; y < array2D.length; y++ ) {
    
    //iteruj po tablicy wartości
    for (var x = 0; x < array2D[0].length; x++ ) {
      
      //pobierz element z tabeli html z matrixy
      //console.log(table_matrix[y+elem_row_idx][x+elem_col_idx])
      if (y+elem_row_idx >= table_matrix.length) {
        //console.log('obcina wiersze');
        y = array2D.length;
        continue;
        
      }
      if (x+elem_col_idx >= table_matrix[0].length) {
        //console.log('obcina kolumny');
        x = array2D[0].length;
        continue;
      }
      
      //console.log('y: '+(y+elem_row_idx)+', x: '+(x+elem_col_idx))
      var elem_to_paste = $( table_matrix[y+elem_row_idx][x+elem_col_idx] ).find(':input:visible');
      
      if (elem_to_paste.is(':checkbox')) {
        elem_to_paste.attr('checked', $.inArray( array2D[y][x], checkbox_flags) > -1 ? true : false );
      }
      else {
        elem_to_paste.val( array2D[y][x] );
      }
      
      
    }
  }
}



function getClipBoardAsArray2D(source) {
  var schowek = $.trim(source);
  
  schowek=schowek.replace(/\t/gi, "\t ");
  var wiersze = schowek.split(/\n/gi);
  
  var clipBoard = [];
  
  var liczba_wierszy = wiersze.length;
  var liczba_kolumn = wiersze[0].split(/\t/gi).length;
  
  for (var x = 0; x < liczba_wierszy ; x++) {
    clipBoard[x] = [];
    for (var y = 0; y < liczba_kolumn ; y++) {
      clipBoard[x][y] = null;
    }
  }

  for(var x=0;x<wiersze.length;x++){
    var kolumny = wiersze[x].split(/\t/gi);
    for(var y=0;y<kolumny.length;y++){
      clipBoard[x][y] = $.trim(kolumny[y]);
    }
  }  
  return clipBoard;
}