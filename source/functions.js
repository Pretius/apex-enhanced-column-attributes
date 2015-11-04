var strings = {
  'report_to_text': 'Report to text',
  'report_to_text2': 'Text to report'
};

function restoreFieldSetInline(elem) {
  var fieldset = $(elem);
  var parent_tr = fieldset.parents('tr').first();

  fieldset.css({
    display: 'block',
    width: 'auto'
  })
  fieldset.find('br').remove();
  parent_tr.css('line-height', 0);
  
  //console.log(fieldset.find(':input').length);
  if (fieldset.find(':input').length < 1) {
    //console.log('ukryj parent_tr');
    parent_tr.css('display', 'none');
  }
  else {
    parent_tr.css('display', 'table-row');
  }
}


///////////////////////
function report_to_text_func(report_id, report_id2) {
  var report = $(report_id);
  
  report.append('<tbody><tr><td>Raport do textu: </td><td><a class="report_to_text" href="javascript:void(0);">'+strings.report_to_text+'</a></td></tr></tbody>')
  
  report.find('.report_to_text').click(report_to_text).data('report_id', report_id2);
  
  $(report_id2).data('report_to_text', true);
  
//  console.log('ustawilem mode na '+$(report_id2).data('report_to_text'))
  
}

function report_to_text(){

  var report_id = $(this).data('report_id');
  
  /*
    mode == true | false | null, true == null == ukryj
    04 - column heading text
    05 - aligment
    06 - heading
    07 - show
    08 - sum
    09 - sort
    10 - sort seq
    11 - column width
  */
  var report = $(report_id);
  
  var mode = report.data('report_to_text') ? true : false;
  //console.log(mode);
  
  var items = '[name=f04], [name=f05], [name=f06], [name=f07], [name=f08], [name=f09], [name=f10], [name=f11]';
  var span_temp = '<span class="to_text">#TEXT#</span>';

  report.find(items).each(function(){ 
    var self = $(this);
    var parent = self.parents('td').first();
  
    if (mode) {
      self.hide();
      
      if ( self.is(':checkbox') ) 
        parent.append( span_temp.replace('#TEXT#',  self.is(':checked') ? 1 : 0));
      else 
        parent.append( span_temp.replace('#TEXT#',  self.val() ));
      
    }
    else {
      self.show();
      parent.find('.to_text').remove();
    }
  });
  
  if (mode) {
    report_container.find('.report_to_text').text(strings.report_to_text2);
    report.find('[headers="ID"], th[id=ID]').hide();
    report.find('td:has(img)').hide()
    
  }
  else {
    report_container.find('.report_to_text').text(strings.report_to_text);
    report.find('[headers="ID"], th[id=ID]').show();
    report.find('td:has(img)').show()
    
  }
  
  report.data('report_to_text', !mode);
}
