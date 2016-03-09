window.fbAsyncInit = function() {
  FB.init({
    appId      : '437925593036770',
    xfbml      : true,
    status     : true,
    version    : 'v2.3'
  });
        

  FB.Event.subscribe('auth.authResponseChange',function(response){
    if(response.status==='connected'){} else{
      FB.login();
    }
  });
};
  // getLoginStatus(function(response) {
  //   if (response.status === 'connected') {
  //     console.log('Logged in.');
  //   }
  //   else {
  //     FB.login();
  //   }
  // });

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function facebookpost(index){
  FB.ui({
  method      : 'feed',
  display     :'popup',
  link        : $('#title'+index).attr("href"),
  name        : $('#title'+index).text(),
  picture     : $('#smallimg'+index).attr("src"),
  caption     : 'Search Information from eBay.com',
  description : $('#description'+index).text()
  }, 
  function(response) {
    if (response && !response.error_code) {
      alert('Posted Successfully.');
    } else {
      alert('Not Posted.');
    }
  });
}