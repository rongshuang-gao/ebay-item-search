<?php
// function isAjax ()
// {
// 	if (
// 		isset($_SERVER['HTTP_X_REQUESTED_WITH']) 
// 		&& $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest") 
// 		return true;
// 	return false;
// }

// if(isAjax()){

	// API request variables
	$endpoint = 'http://svcs.ebay.com/services/search/FindingService/v1';  // URL to call
	$version = '1.0.0';  // API version supported by your application
	$appid = '';  // Replace with your own AppID
	$globalid = 'EBAY-US';  // Global ID of the eBay site you want to search (e.g., EBAY-DE)
	$query = $_GET["keywords"];  // You may want to supply your own query
	$safequery = urlencode($query);  // Make the query URL-friendly

	$i = '0';  // Initialize the item filter index to 0
	$sortquery = $_GET["sort"];
	$pagequery = $_GET["page"];
	$currentpage = $_GET["pagen"];

	$filterarray =array();
	  if ($_GET["priceh"]!=''){
			$highpricearray = array(
					"name"=>"MaxPrice", 
					"value"=>$_GET["priceh"],
					"paramName" => 'Currency',
	    		"paramValue" => 'USD');
			$filterarray[] = $highpricearray;
	  }

	  if ($_GET["pricel"]!=''){
			$lowpricearray = array(
				"name"=>"MinPrice", 
				"value"=>$_GET["pricel"],
				'paramName' => 'Currency',
	    	'paramValue' => 'USD');
			$filterarray[] = $lowpricearray;
	  }

	  if (isset($_GET["condition"])){
	  	$conditionarray = $_GET["condition"];//array store the selected value
			$conarray = array(
				"name"=>"Condition", 
				"value"=>$conditionarray,
				'paramName' => '',
	    	'paramValue' => '');
			$filterarray[] = $conarray;
	  }

	  if (isset($_GET["buy"])){
	  	$buyarray = $_GET["buy"];
			$barray = array(
				"name"=>"ListingType", 
				"value"=>$buyarray,
				'paramName' => '',
	    	'paramValue' => '');
			$filterarray[] = $barray;
	  }

	  if (isset($_GET["return"])){
			$returnarray = array(
				"name"=>"ReturnsAcceptedOnly", 
				"value"=>"true",
				'paramName' => '',
	    	'paramValue' => '');
			$filterarray[] = $returnarray;
	  }

	  if (isset($_GET["freeship"])){
			$freeshiparray = array(
				"name"=>"FreeShippingOnly", 
				"value"=>"true",
				'paramName' => '',
		    'paramValue' => '');
			$filterarray[] = $freeshiparray;
	  }

	  if (isset($_GET["expedship"])){
			$expedshiparray = array(
				"name"=>"ExpeditedShippingType", 
				"value"=>"Expedited",
				'paramName' => '',
	    	'paramValue' => '');
			$filterarray[] = $expedshiparray;
	  }

	  if ($_GET["maxhandle"]!=''){
			$maxhandlearray = array(
				"name"=>"MaxHandlingTime", 
				"value"=> $_GET["maxhandle"],
				'paramName' => '',
	    	'paramValue' => '');
			$filterarray[] = $maxhandlearray;
	  }
	// if (isset($_POST["sort"])){
	// 	$sortarray = array(
	// 		"name"=>"sortOrder", 
	// 		"value"=>$_POST["sort"],
	// 		'paramName' => 'Currency',
	// 		'paramValue' => 'USD');
	// 	$filterarray[] = $sortarray;
	// }


	// Generates an indexed URL snippet from the array of item filters
	function buildURLArray ($filterarray) {
	  global $urlfilter;
	  global $i;
	  // Iterate through each filter in the array
	  foreach($filterarray as $itemfilter) {
	    // Iterate through each key in the filter
	    foreach ($itemfilter as $key =>$value) {
	      if(is_array($value)) {
	        foreach($value as $j => $content) { // Index the key for each value
	          $urlfilter .= "&itemFilter($i).$key($j)=$content";
	        }
	      }else {
	        if($value != "") {
	          $urlfilter .= "&itemFilter($i).$key=$value";
	        }
	      }
	    }
	    $i++;
	  }
	  return "$urlfilter";
	} // End of buildURLArray function

	// Build the indexed item filter URL snippet
	buildURLArray($filterarray);

	// Construct the findItemsByKeywords HTTP GET call 
	$apicall = "$endpoint?";
	$apicall .= "OPERATION-NAME=findItemsByKeywords";
	$apicall .= "&SERVICE-VERSION=$version";
	$apicall .= "&SECURITY-APPNAME=$appid";
	$apicall .= "&GLOBAL-ID=$globalid";
	$apicall .= "&keywords=$safequery";
	$apicall .= "&outputSelector[1]=SellerInfo";
	$apicall .= "&outputSelector[2]=PictureURLSuperSize";
	$apicall .= "&outputSelector[3]=StoreInfo";
	$apicall .= "&sortOrder=$sortquery";
	$apicall .= "&paginationInput.entriesPerPage=$pagequery";
	$apicall .= "&paginationInput.pageNumber=$currentpage";
	$apicall .= "$urlfilter";

	// Load the call and capture the document returned by eBay API
	$resp = simplexml_load_file($apicall);
	// $json = json_encode($resp);
	// $array = json_decode($json,TRUE);

	// foreach($array["searchResult"]["item"] as $item){
	// 	$shiptype = $item["shippingInfo"]["shipToLocations"];
	// 	// foreach($shiptype as $key=>$value)
	// 	// echo $value;
	// 	echo json_encode($shiptype);
	// 	}
	
	

	$totalout = array();
	if ($resp->ack == "Success"){
		$totalnumb = $resp->paginationOutput->totalEntries;
		$pagenumb = $resp->paginationOutput->pageNumber;
		$itemcount = $resp->paginationOutput->entriesPerPage;

		// class jsonout{
		// 	var $ack;
		// 	var $resultCount;
		// 	var $pageNumber;
		// 	var $itemCount;
		// 	public function __toString(){
		// 		return
		// 	}
		// }
		// $output = new jsonout();

		// $output -> ack = "Success";
		// $output -> resultCount = (string)$totalnumb;
		// $output -> pageNumber = (string)$pagenumb;
		// $output -> itemCount = (string)$itemcount;
		if($totalnumb==0){
				$jsonoutput = array(
					"ack"=>"No results found"
				);

		}
		else{
		$jsonoutput=array(
			"xml"=>(string)$apicall,
			"ack"=>"Success",
			"resultCount"=>(string)$totalnumb,
			"pageNumber" => (string)$pagenumb,
			"itemCount" => (string)$itemcount
			);

		  	// function convert($selectarray){
		   // 		$terms = count($selectarray);
		   // 		foreach ($selectarray as $key => $value) {
		   // 			$terms--;
		   // 			$str.=$key .':'. $value;
		   // 			if($terms){
		   // 				$str .= ',';
		   // 			}
		   // 		}
		   // 		return $str;
		   // 	}

		$terms = 0;
		foreach($resp->searchResult->item as $item) {

		    $title = $item->title;
		    $link  = $item->viewItemURL;
		    $pic   = $item->galleryURL;
		    $picsuper = $item->pictureURLSuperSize;
		    $pri= $item->sellingStatus->convertedCurrentPrice;
		    $shipcost = $item->shippingInfo->shippingServiceCost;
		    $conditionname = $item->condition->conditionDisplayName;
		    $listing = $item->listingInfo->listingType;
		    $loc = $item->location;
		    $category = $item->primaryCategory->categoryName;
		    $top= $item->topRatedListing;
		    $username= $item->sellerInfo ->sellerUserName;
		    $feedback = $item->sellerInfo ->feedbackScore;
		    $posipercent= $item->sellerInfo->positiveFeedbackPercent;
		    $feedrating= $item->sellerInfo->feedbackRatingStar;
		    $topseller = $item ->sellerInfo->topRatedSeller;
		    $storename = $item->storeInfo->storeName;
		    $storeurl = $item->storeInfo->storeURL;
		    $shiptype = $item->shippingInfo->shippingType;

		    //there is a problemunsolved!
		    $expship = $item->shippingInfo->expeditedShipping;
		    $onedayship = $item->shippingInfo->oneDayShippingAvailable;
		    $ret = $item->returnsAccepted;
		    $handt= $item->shippingInfo->handlingTime;

		    //$shiptolocation = $item->shippingInfo->getElementsByTagName("shipToLocations")->length;

		    $conditionid = $item->condition->conditionId;
		    
		 	$shiptolocarray=array();
		    $i=0;
		    foreach($item->shippingInfo->shipToLocations as $shiptolocation){
		    	$i++;
		    }
		    if($i==1){
		    	$shiptolocone=(string)$shiptolocation;
		    	$shiparray=array(
		    	"shippingType"=>(string)$shiptype,
		    	"shipToLocations"=>$shiptolocone,
		    	"expeditedShipping"=>(string)$expship,
		    	"oneDayShippingAvailable"=>(string)$onedayship,
		    	"returnsAccepted"=>(string)$ret,
		    	"handlingTime"=>(string)$handt
		    	);
		    }
		    else{
		    	foreach($item->shippingInfo->shipToLocations as $shiptolocation){
		    	$shiptolocarray[]=(string)$shiptolocation;
		    	$shiparray=array(
		    	"shippingType"=>(string)$shiptype,
		    	"shipToLocations"=>$shiptolocarray,
		    	"expeditedShipping"=>(string)$expship,
		    	"oneDayShippingAvailable"=>(string)$onedayship,
		    	"returnsAccepted"=>(string)$ret,
		    	"handlingTime"=>(string)$handt
		    	);
		    	}
			}
		    
		    $basicarray=array(
		    	"title"=>(string)$title,
		    	"viewItemURL"=>(string)$link,
		    	"galleryURL"=>(string)$pic,
		    	"pictureURLSuperSize"=>(string)$picsuper,
		    	"convertedCurrentPrice"=>(string)$pri,
		    	"shippingServiceCost"=>(string)$shipcost,
		    	"conditionDisplayName"=>(string)$conditionname,
		    	"listingType"=>(string)$listing,
		    	"location"=>(string)$loc,
		    	"categoryName"=>(string)$category,
		    	"topRatedListing"=>(string)$top
		    	);
		    //$basicstr= convert($basicarray);
		    $sellerarray=array(
		    	"sellerUserName"=>(string)$username,
		    	"feedbackScore"=>(string)$feedback,
		    	"positiveFeedbackPercent"=>(string)$posipercent,
		    	"feedbackRatingStar"=>(string)$feedrating,
		    	"topRatedSeller"=>(string)$topseller,
		    	"sellerStoreName"=>(string)$storename,
		    	"sellerStoreURL"=>(string)$storeurl,
		    	);
		    //$sellerstr = implode(',',$sellerarray);
		    // $shiparray=array(
		    // 	"shippingType"=>(string)$shiptype,
		    // 	"shipToLocations"=>$shiptolocarray,
		    // 	"expeditedShipping"=>(string)$expship,
		    // 	"oneDayShippingAvailable"=>(string)$onedayship,
		    // 	"returnsAccepted"=>(string)$ret,
		    // 	"handlingTime"=>(string)$handt
		    // 	);
		    //$shipstr = implode(',',$shiparray);

		    $itemarray=array(
				"basicInfo"=>$basicarray,
				"sellerInfo"=>$sellerarray,
				"shippingInfo"=>$shiparray
					);
		    //$itemstr = implode(',', $itemarray);
		    
		    $jsonoutput['item'.$terms]=$itemarray;
			$terms++;
		}
	}

	//echo $apicall;
	echo json_encode($jsonoutput);
	}
?>