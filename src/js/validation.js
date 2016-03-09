validation();
function validation(){
// just for the demos, avoids form submit
jQuery.validator.setDefaults({
  debug: true,
  onblur:true,
});
    
var validator = $( "#myform" ).validate({
  rules: {
    keywords: {
      required: true,
      postiveIntegerNumber : "\\S",
    },
    pricel: {
      number: true,
      postiveIntegerNumber : "^\\d.*$"
    },
    priceh: {
      number: true,
      postiveIntegerNumber : "^\\d.*$",
      greaterThan: "#pricel"
    },
    maxhandle: {
      number: true,
      digits: true,
      min: 1
    }
  },

  messages: {
    keywords: {
      required: "<span class='text-danger'>Please enter a key word<span>",
      postiveIntegerNumber: "<span class='text-danger'>Please enter a key word<span>"
    },
    pricel: {
      number: "<span class='text-danger'>Price should be a valid number<span>",
      postiveIntegerNumber : "<span class='text-danger'>Minimum price cannot be below 0<span>"
    },
    priceh: {
      number: "<span class='text-danger'>Price should be a valid number<span>",
      greaterThan:"<span class='text-danger'>Maximum price cannot be less than minimum price or below 0<span>",
      postiveIntegerNumber : "<span class='text-danger'>Maximum price cannot be less than minimum price or below 0<span>"
    },
    maxhandle: {
      number: "<span class='text-danger'>Max handling time should be a valid digit<span>",
      digits: "<span class='text-danger'>Max handling time should be a valid digit<span>",
      min: "<span class='text-danger'>Max handling time should be greater than or equal to 1<span>"
    }
  },

  highlight: function(element) {  
              $(element).parent().addClass("has-error");
              //$(element).css("","red");
  },  
  unhighlight:function(element){
              $(element).parent().removeClass("has-error");
  }
    // errorPlacement : function(error, element) {
    //  error.css('font-color','#ff0000');
    //  element.after(error);
    // }
});

  $("#reset").click(function(){
     validator.resetForm();
     $(".has-error").removeClass("has-error");
     });
}