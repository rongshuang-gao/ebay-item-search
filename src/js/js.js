$(function() {
     $.validator.addMethod(
         "postiveIntegerNumber",
         function(value, element, regexp) {
             var re = new RegExp(regexp);
             return this.optional(element) || re.test(value);
     });
   });

$(function() {
  $.validator.addMethod("greaterThan",
   function (value, element, param) {
     var $min = $(param);
     if(($min.val()!="")&&(value!="")){
       if (this.settings.onfocusout) {
       $min.off(".validate-greaterThan").on("blur.validate-greaterThan", function () {
         $(element).valid();
       });
     }
     
     return parseInt(value) >= parseInt($min.val());
   }
   else return true;
   
   }, "Maximum price cannot be lesser than minimum price");
 });



       
//output the items
function checknull(inputstr){
  var output;
  if(inputstr==null||inputstr==""){
    output="N/A";
  }
  else output = inputstr;
  return output;
};


function replaceicon(str){
  var icon;
  if(str=="true"){
  icon="<span class='glyphicon glyphicon-ok' style='color:green'></span>";
  }
  else {
    icon="<span class='glyphicon glyphicon-remove' style='color:#CC0000'></span>";
  }
    return icon;
};

function display(obj,index){       
  console.log(obj.xml);
  var result='';
  if(obj.ack=="Success"){
  //output the first line
  var itemcount = parseInt(obj.itemCount);
  var resultcount = parseInt(obj.resultCount);
  pagenumber = parseInt(obj.pageNumber);
  var count;

  if((itemcount*pagenumber)<=resultcount){
    count = itemcount;
  }else{
    count = resultcount-itemcount*(pagenumber-1);
  }

  if((resultcount%itemcount)==0){
    totalpage=parseInt(resultcount/itemcount);
  }else{
    totalpage=parseInt(resultcount/itemcount) +1;
  }

  var resultsrange1 = (itemcount * (pagenumber-1)) + 1;
  var resultsrange2 = resultsrange1 + count-1;

  $(document).ready(function(){
    $("#output1").html("<b>"+ resultsrange1+"-"+resultsrange2+" items out of "+obj.resultCount+"</b>");
  });
             
  for(i=0;i<count;i++){
    var pic = checknull(obj["item"+i].basicInfo.galleryURL);
    var picsuper = checknull(obj["item"+i].basicInfo.pictureURLSuperSize);
    var name = checknull(obj["item"+i].basicInfo.title);
    var link = checknull(obj["item"+i].basicInfo.viewItemURL);
    var pri = checknull(obj["item"+i].basicInfo.convertedCurrentPrice);
    //shipcost for free shipping check
    var shipcost = obj["item"+i].basicInfo.shippingServiceCost;
    var shipcoststr;
    var pricestr;
    var loc = checknull(obj["item"+i].basicInfo.location);
    //top icon output below
    var top = obj["item"+i].basicInfo.topRatedListing;
    var locationstr;
    var toppic;
    var topstr;
    var detailstr;
    var categoryname = checknull(obj["item"+i].basicInfo.categoryName);
    var conditionname = checknull(obj["item"+i].basicInfo.conditionDisplayName);
    //buyformat set below
    var buyformat = obj["item"+i].basicInfo.listingType;
    var buyformatstr;
    var username = checknull(obj["item"+i].sellerInfo.sellerUserName);
    var feedbackscore = checknull(obj["item"+i].sellerInfo.feedbackScore);
    var posipercent = checknull(obj["item"+i].sellerInfo.positiveFeedbackPercent);
    var ratestar = checknull(obj["item"+i].sellerInfo.feedbackRatingStar);
    //toprated icon check below
    var topranted = obj["item"+i].sellerInfo.topRatedSeller;
    //sellerstore output check below
    var sellerstore = obj["item"+i].sellerInfo.sellerStoreName;
    var sellerurl = obj["item"+i].sellerInfo.sellerStoreURL;
    //shiptype split below
    var shiptype = checknull(obj["item"+i].shippingInfo.shippingType);
    var shiplocation = checknull(obj["item"+i].shippingInfo.shipToLocations);
    //handltime check below
    var handltime = obj["item"+i].shippingInfo.handlingTime;
    var expship = checknull(obj["item"+i].shippingInfo.expeditedShipping);
    var onedayship = checknull(obj["item"+i].shippingInfo.oneDayShippingAvailable);
    var returnaccp = checknull(obj["item"+i].shippingInfo.returnsAccepted);
 

    //shipcost freeshipping check
    if (shipcost==0 || shipcost == null || shipcost==""){
      shipcoststr = " (FREE Shipping)";
    }else{
      shipcoststr = " (+ $"+shipcost+" for shipping)";
    }

    //store field output
    var sellerout;
    if (sellerstore==null||sellerstore == ""){
      sellerout = "N/A";
    }else{
      sellerout="<a href='"+sellerurl+"' target='_blank'>"+ sellerstore +"</a>";
    }

    //buyformat string set
    if(buyformat=="FixedPrice"||buyformat=="StoreInventory"){
      buyformatstr="Buy It Now";
    }else if(buyformat=="Auction"){
      buyformatstr="Auction";
    }else if(buyformat=="Classified"){
      buyformatstr="Classified Ad";
    }else if (buyformat==""||buyformat==null){
      buyformatstr="N/A";
    }else{
      buyformatstr=buyformat;
    }

    //toprated pic output
    if(top=="true"){
      toppic = "<img src='http://cs-server.usc.edu:45678/hw/hw6/itemTopRated.jpg' height='30px' width='30px'>";//the size should be changed in smaller device 
    }else{
      toppic = "";
    }

    //toprated icon output
    if(topranted==""||topranted==null){
      topstr = "N/A";
    }else if(topranted=="true"){
      topstr="<span class='glyphicon glyphicon-ok' style='color:green'></span>";
    }else{
      topstr="<span class='glyphicon glyphicon-remove' style='color:#CC0000'></span>";
    }

    if(handltime==null||handltime==""){
      handlstr = "N/A";
    }else{
      handlstr = handltime+" day(s)";
    }

    //shiptype split
    if(shiptype=="NotSpecified"){
      shiptypestr=shiptype;
    }else{
      var shiptypestr = shiptype.split(/(?=[A-Z])/g);
    }


    //change the string to icon
    expicon = replaceicon(expship);
    onedayicon = replaceicon(onedayship);
    returnicon = replaceicon(returnaccp);

    pricestr = "<b>Price: $"+ pri +"</b>"+ shipcoststr;
    locationstr = "<i>Location: "+ loc + "</i>";
    pricloc="<span id='description"+i+"'>"+pricestr+ "&nbsp&nbsp&nbsp&nbsp"+locationstr+"</span>";

    detailstr = "<a data-toggle='collapse' href='#' onclick='return false;' 
                data-target='#demo"+i+"'>View Details</a>";
    // + "<div id='demo"+i+"' class = 'collapse collapse'>alsdncowiuoiwjklncd</div>";
    tabstr = "<div id='demo"+i+"' class = 'collapse collapse'>
              <ul class='nav nav-tabs'>
                <li class='active'><a href='#basic"+i+"' data-toggle='tab'>Basic Info</a></li>
                <li><a href='#seller"+i+"' data-toggle='tab'>Seller Info</a></li>
                <li><a href='#shipping"+i+"' data-toggle='tab'>Shipping Info</a></li>
              </ul>";     

    basicstr = "<div class='row'>
                  <div class='col-sm-3 col-md-3'><b>Category name</b></div>
                  <div class='col-sm-5 col-md-5'>"+ categoryname +"</div>
                </div>"
                +
                "<div class='row'>
                  <div class='col-sm-3 col-md-3'><b>Condition</b></div>
                  <div class='col-sm-5 col-md-5'>"+ conditionname +"</div>
                </div>"
                +
                "<div class='row'>
                  <div class='col-sm-3 col-md-3'><b>Buying format</b></div>
                  <div class='col-sm-5 col-md-5'>"+ buyformatstr +"</div>
                </div>";

    sellersrt = "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>User name</b></div>
                    <div class='col-sm-5 col-md-5'>"+ username +"</div>
                  </div>"
                  +
                  "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>Feedback score</b></div>
                    <div class='col-sm-5 col-md-5'>"+ feedbackscore +"</div>
                  </div>"
                  +
                  "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>Positive feedback</b></div>
                    <div class='col-sm-5 col-md-5'>"+ posipercent +"</div>
                  </div>"
                  +
                  "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>Feedback rating</b></div>
                    <div class='col-sm-5 col-md-5'>"+ ratestar +"</div>
                  </div>"
                  +
                  "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>Top rated</b></div>
                    <div class='col-sm-5 col-md-5'>"+ topstr +"</div>
                  </div>"
                  +
                  "<div class='row'>
                    <div class='col-sm-3 col-md-3'><b>Store</b></div>"
                    +
                    "<div class='col-sm-5 col-md-5'>"+sellerout+"</div>
                  </div>";

    shipstr = "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>Shipping type</b></div>
                <div class='col-sm-5 col-md-5'>"+ shiptypestr +"</div>
              </div>"
              +
              "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>Handling time</b></div>
                <div class='col-sm-5 col-md-5'>"+ handlstr +"</div>
              </div>"
              +
              "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>Shipping locations</b></div>
                <div class='col-sm-5 col-md-5'>"+ shiplocation +"</div>
              </div>"
              +
              "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>Expedited shipping</b></div>
                <div class='col-sm-5 col-md-5'>"+ expicon +"</div>
              </div>"
              +
              "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>One day shipping</b></div>
                <div class='col-sm-5 col-md-5'>"+ onedayicon +"</div>
              </div>"
              +
              "<div class='row'>
                <div class='col-sm-3 col-md-3'><b>Returns accepted</b></div>
                <div class='col-sm-5 col-md-5'>"+ returnicon +"</div>
              </div>";

    tabcontentstr = "<div id='mytabcontent' class='tab-content'>
                      <div class='tab-pane in active' id='basic"+i+"'>"+basicstr+"</div>
                      <div class='tab-pane' id='seller"+i+"'><p>"+sellersrt+"</p></div>
                      <div class='tab-pane' id='shipping"+i+"'><p>"+shipstr+"</p></div>
                    </div>
                    </div>";

    modalbody = "<div class='media'>
                  <a class='pull-left' data-toggle='modal' data-target='#myModal"+i+"'>
                    <div class='media-object'>
                      <center><img src='"+ pic +"' width=50px; height=50px; 
                      id='smallimg" + i + "' alt='N/A'></center>
                    </div>
                  </a>"
                  +
                  "<div class='modal fade' id = 'myModal"+i+"' tabindex='-1' 
                  role='dialog' aria-labelledby='myModaltitle' aria-hidden='true'>
                    <div class='modal-dialog'>
                      <div class='modal-content'>
                        <div class='modal-header'>
                          <button type='button' class='close' data-dismiss='modal' 
                                  aria-hidden='true'>&times;</button>
                          <h4 class='modal-title' id='myModaltitle'>"+name+"</h4>
                        </div>
                        <div class='modal-body'>
                          <center><img class='img-responsive' src='"+picsuper+"' 
                            alt='N/A'></center>
                        </div>
                      </div>
                    </div>
                  </div>";

    facebookbody="<img src='http://cs-server.usc.edu:45678/hw/hw8/fb.png' 
                  height='20px' width='20px' onclick=\"facebookpost("+i+")\" 
                  id='fb"+i+"'>"; 
    // facebookbody+="
    // <script>
    // $(document).ready(function(){
    //   $('#fb"+i+"').click(function(){
    //     FB.ui(
    //       {method: 'feed',
    //       display:'popup',
    //       caption:'ggggg',
    //       description:('eeeee'),
    //       name:'abced',
    //       message:'bbbbb'},
    //       function(response) {
    //         if (response && !response.error_code) {
    //           alert('Posting completed.');
    //         } else {
    //           alert('Error while posting.');
    //         }
    //       });
    //   });
    // });
    // <\/script>";
    
    result += modalbody + "<div class='media-body'>
                            <h4 class='media-heading'>
                              <a id='title"+i+"' href='"+ link + "' target='_blank'>"+name+"</a>
                            </h4>" 
                            + pricloc+ "&nbsp&nbsp"+ toppic+ "&nbsp&nbsp" 
                            + detailstr+ "&nbsp&nbsp"+facebookbody+ tabstr 
                            + tabcontentstr+"
                          </div></div>";
  }
                  

  //result+=pagebody;
  $(document).ready(function(){
     //$("#output2").html(result);
     $("#output3").show();
   });
  }else{
    $(document).ready(function(){
      $("#output1").html("<b>No results found</b>");
      $("#output3").hide();
    });
  }
              
            
  $(document).ready(function(){
    $("#output2").html(result);
  });
           
          
  if(index==0){
    buildPagination( 1 );
    $(".pagination li:first").addClass("disabled");
    $("#page1").addClass("active");
  }else{
    $(".pagination .active").removeClass("active");
    $("#page"+pagenumber).addClass("active");
    if(pagenumber>1){
      $(".pagination li:first").removeClass("disabled");
    }else{
      $(".pagination li:first").addClass("disabled");
    }
    if(pagenumber==totalpage){
      $(".pagination li:last").addClass("disabled");
    }else{
      $(".pagination li:last").removeClass("disabled");
    }
  }
}
function prevPage(){
  var prevPage=pagenumber-1;
  if( pagenumber%5 == 1 && pagenumber>5){
    var prevPageIni=pagenumber-5;
    $("#page-item").remove();
    buildPagination( prevPageIni );
  }
  ajaxcall("#myform",prevPage,1);
}

function nextPage(){
  var nextPage=pagenumber+1;
  if( pagenumber%5 == 0 ){
      $("#page-item").remove();
      buildPagination( nextPage );
  }
  ajaxcall("#myform",nextPage,1);
}

function buildPagination( initPage ){
  var pagebody = "<nav><ul class='pagination'>
                  <li><a href='###' onclick='prevPage()'>&laquo;</a></li>";
  for( var i = initPage; i < Math.min(initPage + 5,totalpage+1); i++ ){
    pagebody += "<li id='page"+i+"'><a href='###'  onclick=\"ajaxcall('#myform',"+i+",1)\">"+i+"</a></li>";
  }
  pagebody += "<li><a href='###' onclick=\"nextPage()\">&raquo;</li></ul></nav>";
  $("#output3").html(pagebody);
}

function ajaxcall(form,pageindex,initial){
  validation();
  var index= initial;
  // var index = false;
  // if (initial==0){
  //   index=true;
  // }

  var params = $(form).serialize();

  var pageindexstr = "&pagen="+pageindex;
  params += pageindexstr; 
  //alert(params);
  var url = "index.php";

  $.ajax({
    url: url,
    data: params,
    type:'GET',
    //async:false,
    success: function(output){
      var object = jQuery.parseJSON(output);
      display(object,index);
    },
    error: function(){
      }
    });
}

$(document).ready(function(){
    $("#reset").click(function(){
        $("#output1").empty();
        $("#output2").empty();
        $("#output3").empty();
        $(".error").removeClass("error");
        
    });
});