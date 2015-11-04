console.log('APEX CHROME plugin loaded: replaceColumns.js');

function setReplaceAllRowsColumn(report) {
  $('th', report).each(function(){
    var th = $(this);
    var current_position = th.prevAll().length;
    var parent_tr = th.parents('tr').first();
    var next_tr = parent_tr.next();

    var td_below = $(next_tr.find('td')[current_position]);
    var td_input = td_below.find(':input:visible').not(':disabled,:radio')
    
    th.data('position', current_position);
    th.data('th', th.html());
    th.data('parent_tr', parent_tr);
    
    if (td_input.length != 0) {
      //$('#a').attr("data-toggle", "tooltip")
      th.data('input', td_input.clone() );
      
      th.dblclick(function(current_position){
        //double click na th
        var self = $(this);
        self.html( self.data('input') );
        //pokaz tooltip
        
        var th_item = self.data('input');
        
        if ( self.data('input') ) {
          $(th_item).popover({
            'html': true,
            'title': '',
            'content': 'To accept the change press <b>ENTER.</b> <br>To decline change press <b>ESCAPE</b>. ',
            'trigger': 'manual',
            'placement': 'top'
          }).popover('show');
        }
        
        var input = self.find(':input, select option');
        
        //wspolne dla blur() i keyup();
        
        var value = input.val();
        var parent_tr = th.data('parent_tr');
        var position = th.data('position');
        
        input.blur(function(){
          //console.log('blur');
          /*
          if ( $(this).is(':not(:checkbox)') ) {
            var result = confirm('Czy chcesz nadpisać wartość "'+self.data('th')+'" w całej kolumnie?');
            
            //console.log(result);
            
            var value = $(this).val();
            
            //if (result && $(this).is(':not(:checkbox)')) {
            if (result) {
              $( '[name='+$(this).attr('name')+']:visible' ).val(value).trigger('change');;
            }
            
          }
          */
          self.html(self.data('th'));
          
        });
        
        input.focus().keypress(function(event){
          
          
          if (event.keyCode == 13) {
          
            if ( $(this).is(':checkbox') ) {
              var checked = $(this).attr('checked') == 'checked' ? true : false;
              
              $( '[name='+$(this).attr('name')+']:visible' ).attr('checked', checked);
              $( '[name='+$(this).attr('name')+']:visible' ).trigger('change')
              self.html(self.data('th'));
            }
            else {
              var value = input.val();
              $( '[name='+$(this).attr('name')+']:visible' ).val(value).trigger('change');
              self.html(self.data('th'));
            }
          }
        }).keydown(function(){
          //obsluga escape wymaga keydown
          if (event.keyCode == 27) {
            self.html(self.data('th'));
          }
        
        });
      });
    }
  });
}