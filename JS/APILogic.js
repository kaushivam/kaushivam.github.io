
var flag=0;    
var SelectedCountry="IN";    
var CountryCodeDict={};       

setCount =function(number)
{
    if(parseInt(number)<1000)
    {
        return number;
    }
    else if(parseInt(number)>1000 && parseInt(number)<1000000)
    {
        return ((parseInt(number)/1000).toFixed(2) + ' K');
    }
    else if(parseInt(number)<1000000000 && parseInt(number)>1000000)
    {
        return ((parseInt(number)/1000000).toFixed(2) + ' M');
    }
    else
    {
        return ((parseInt(number)/1000000000).toFixed(2) + ' B');
    }
}
      
fetchnext100Comments=function(nextPageToken, comments,VideoID,APIKey)
{
    var pageToken;
if(nextPageToken!=undefined)
{
const url2="https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&type=''&textFormat=plainText&maxResults=100&pageToken="+nextPageToken+"&videoId="+VideoID+"&key="+APIKey;
fetch(url2)
.then((resp2) => resp2.json())
.then(function(data2) {
    console.log('Commemts: '+comments);
    console.log(data2);
    let p=data2.items;
    let CurrentComment;
    for(var i=0;i<p.length;i++)
    {
        var d1=new Date($('#AsOfDateInput').val());
  
        var d2=new Date(p[i].snippet.topLevelComment.snippet.publishedAt);
     
   
        if(d1>d2)
        {
            comments++;
        }

    }

pageToken=data2.nextPageToken;
if(pageToken!=undefined)
{
    console.log('Total Counts inital : '+ comments);
    fetchnext100Comments(pageToken,comments,VideoID,APIKey);
}
else
{
    $('#SinglevideoCommentADCount')[0].textContent=setCount(comments);
return;
}

})
}
else
{
$('#SinglevideoCommentADCount')[0].textContent=setCount(comments);
return;
}

}

$( document ).ready(function() {
    console.log( "ready!" + $('#AllVideos')[0] );
    fetchTrendingVideos(SelectedCountry);
    plotCountryDropdown();
  
  
    
});

plotCountryDropdown=function ()
{

    var mydata = data;
    console.log('Countries');
    console.table(mydata);
 
    $('#Countries').empty();
    for(var i=0;i<mydata.length;i++)
    {
        CountryCodeDict[mydata[i].name]=mydata[i].alpha2;
        $('#Countries').append('<a class="dropdown-item eachCountry" href="#">'+mydata[i].name+'</a>');
        $('.eachCountry').unbind('click').bind('click',function(){
          console.log('Country ' +$(this)[0].innerText);
          console.log('CountryCode ' +CountryCodeDict[$(this)[0].innerText]);
          SelectedCountry=CountryCodeDict[$(this)[0].innerText];
          fetchTrendingVideos(SelectedCountry);
        })
    }

}

fetchTrendingVideos=function ( country)
{
    var APIKey='AIzaSyBjGSNm15yAh0grnhBh9CgThANMzZdxnTE'
    var maxResults=8;
    var url="https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode="+country+"&maxResults="+maxResults+"&key="+APIKey;
   
    $('#AllVideos').empty();
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
let pictures = data.items;
console.log('Picture '+ pictures);
plotAllVideoScreen(data,APIKey,1);
})
}



plotAllVideoScreen =function(data,APIKey,trendingFlag)
{
let pictures = data.items;
console.log('Picture ');
console.table(pictures);

for(var i=0;i<pictures.length;i++)
{
    var imgSrc=pictures[i].snippet.thumbnails.high.url;
    txt = document.createElement('text');
txt.innerText = trendingFlag==0?pictures[i].id.videoId: pictures[i].id;
$('#AllVideos').append('<div id="video_'+i+'" class="EachVideoClass" title="'+txt.innerText+'"><div id="VideoEach_'+i+'" class="EachVidClass"><img src="'+imgSrc+'" alt="Failed to Laod Image" width="300" height="200"></div></div>');

var s = "https://www.youtube.com/embed/"+txt.innerText ;  
let itt =document.createElement('iframe');
itt.setAttribute('src', s);
itt.setAttribute('width', '300');
itt.setAttribute('height', '200');

//$('#VideoEach_'+i).append(itt);

$('#video_'+i).append('<div id="'+txt.innerText+'" class="EachVideoDescClass">'+
'<div id="videoName_'+i+'" class="EachVideoNameClass">'+pictures[i].snippet.title+'</div>'+

'<div id="ChannelName_'+i+'" class="EachChannelNameClass">'+pictures[i].snippet.channelTitle+'</div>'+
'<div id="Description_'+i+'" class="EachDescriptionClass">'+pictures[i].snippet.description.substring(0,200)+'</div></div>'
);
$('.EachVideoClass').unbind('click').bind('click',function(){
    let VideoID=$(this)[0].title;
    plotSingleVideoScreen(VideoID,APIKey,trendingFlag)

})
}
}
  

plotSingleVideoScreen=function(VideoID,APIKey,trendingFlag)
{
   
$('#AllVideos').empty();
if(trendingFlag==1){
$('#AllVideos').append('<div id="SinglevideoAndDesc"><div id="singleVideo"></div>'+
'<div id="singleVideoDesc">'+
'<div id="gap">Watching !! </div><div id="SinglevideoClose" class="SinglevideoCloseClass"> X</div>'+ 
'<div id="singleVideoNameComments">'+
'<div id="SinglevideoName" class="SinglevideoNameClass"></div>'+ 
'<div id="SingleChannelName" class="SingleChannelNameClass"></div>'+
'<div id="SingleDescription" class="SingleDescriptionClass"></div>'+ 
'<div id="SinglevideoStats" class="SinglevideoStatsClass">'+
'<div id="SinglevideoComment" class="SinglevideoCommentClass"><i class="fa fa-comment"></i><div id="SinglevideoCommentCount" class="SinglevideoCommentCountClass"></div></div>'+
'<div id="SinglevideoView" class="SinglevideoViewClass"><i class="fa fa-eye"></i><div id="SinglevideoViewCount" class="SinglevideoViewCountClass"></div></div>'+
'<div id="SinglevideoLike" class="SinglevideoLikeClass"><i class="fa fa-thumbs-up"></i><div id="SinglevideoLikeCount" class="SinglevideoLikeCountClass"></div></div>'+
'<div id="SinglevideoDisLike" class="SinglevideoDisLikeClass"><i class="fa fa-thumbs-down"></i><div id="SinglevideoDisLikeCount" class="SinglevideoDisLikeCountClass"></div></div>'+
'</div>'+
'<div id="SingleVideoComments" class="SingleVideoCommentsClass"></div>'+
'</div></div></div>');
}
else{
    $('#AllVideos').append('<div id="SinglevideoAndDesc"><div id="singleVideo"></div>'+
    '<div id="singleVideoDesc">'+
    '<div id="gap">Watching !! </div><div id="SinglevideoClose" class="SinglevideoCloseClass"> X</div>'+ 
    '<div id="singleVideoNameComments">'+
    '<div id="SinglevideoName" class="SinglevideoNameClass"></div>'+ 
    '<div id="SingleChannelName" class="SingleChannelNameClass"></div>'+
    '<div id="SingleDescription" class="SingleDescriptionClass"></div>'+ 
    '<div id="SinglevideoStats" class="SinglevideoStatsClass">'+
    '<div id="SinglevideoComment" class="SinglevideoCommentClass"><i class="fa fa-comment"></i><div id="SinglevideoCommentCount" class="SinglevideoCommentCountClass"></div></div>'+
    '<div id="SinglevideoCommentAD" class="SinglevideoCommentADClass"><i class="fa fa-comments-o"></i><div id="SinglevideoCommentADCount" class="SinglevideoCommentADCountClass"></div></div>'+
    '<div id="SinglevideoView" class="SinglevideoViewClass"><i class="fa fa-eye"></i><div id="SinglevideoViewCount" class="SinglevideoViewCountClass"></div></div>'+
    '<div id="SinglevideoLike" class="SinglevideoLikeClass"><i class="fa fa-thumbs-up"></i><div id="SinglevideoLikeCount" class="SinglevideoLikeCountClass"></div></div>'+
    '<div id="SinglevideoDisLike" class="SinglevideoDisLikeClass"><i class="fa fa-thumbs-down"></i><div id="SinglevideoDisLikeCount" class="SinglevideoDisLikeCountClass"></div></div>'+
    '</div>'+
    '<div id="SingleVideoComments" class="SingleVideoCommentsClass"></div>'+
    '</div></div></div>');  
}

$('#SinglevideoClose').unbind('click').bind('click',function()
{
   $('#AllVideos').empty();
   
   if(trendingFlag==1)
   fetchTrendingVideos(SelectedCountry);
   else
   loadVideos();
});
 fetchAndPlotVideoStats(VideoID,APIKey);
 fetchAndPlotComments(VideoID,APIKey,trendingFlag);

}

fetchAndPlotVideoStats=function(VideoID,APIKey)
{
 var   url3="https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&type=''&id="+VideoID+"&key="+APIKey;
fetch(url3)
.then((resp3) => resp3.json())
.then(function(data3) {
    console.log(data3);
let Videodata=data3.items;


txt1 = document.createElement('text');
txt1.innerText = Videodata[0].id.videoId;
var s = "https://www.youtube.com/embed/"+VideoID ;  
let itt =document.createElement('iframe');
itt.setAttribute('src', s);
itt.setAttribute('width', '600');
itt.setAttribute('height', '400');

$('#singleVideo').append(itt);
var likes=setCount(Videodata[0].statistics.likeCount);
var dislikes=setCount(Videodata[0].statistics.dislikeCount);
var comments=setCount(Videodata[0].statistics.commentCount);
var view=setCount(Videodata[0].statistics.viewCount);
$('#SinglevideoViewCount')[0].textContent=view;
$('#SinglevideoLikeCount')[0].textContent=likes;
$('#SinglevideoDisLikeCount')[0].textContent=dislikes;
$('#SinglevideoCommentCount')[0].textContent=comments;


$('#SinglevideoName')[0].textContent=Videodata[0].snippet.title;
$('#SingleChannelName')[0].textContent=Videodata[0].snippet.channelTitle;
$('#SingleDescription')[0].textContent=Videodata[0].snippet.description.substring(0,60);

})
}
fetchAndPlotComments =function(VideoID,APIKey,trendingFlag)
{
var CommentTotal=0;
var url2="https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&type=''&textFormat=plainText&maxResults=100&videoId="+VideoID+"&key="+APIKey;
fetch(url2)
.then((resp2) => resp2.json())
.then(function(data2) {
    console.log('Commemts: ');
    console.log(data2);
    let p=data2.items;
    let CurrentComment;
    if(trendingFlag==1)
    PlotCommentsForTrending(p);
    else
    PlotAllComments(p,CommentTotal);
 
if(trendingFlag==0)
{
fetchnext100Comments(data2.nextPageToken,CommentTotal,VideoID,APIKey);  
}
})
}

PlotCommentsForTrending =function(p)
{
    for(var i=0;i<p.length;i++)
    {
        CurrentComment=p[i].snippet.topLevelComment.snippet;
        $('#SingleVideoComments').append('<div id="Comment'+i+'" class="CommentsClass">'+
        '<div id="CommenterNameAndLikes_'+i+'"class="CommenterNameAndLikesClass">'+
        '<div id="CommenterName_'+i+'"class="CommenterNameClass"></div>'+
        '<div id="CommenterLikes_'+i+'"class="CommenterLikesClass"><i class="fa fa-thumbs-up"></i><div id="CommenterLikesCount_'+i+'" class="CommenterLikesCountClass"></div></div>'+
        '</div>'+
        '<div id="CommentText_'+i+'"class="CommentTextClass"></div>'+
        '<div id="CommentDate_'+i+'"class="CommentDateClass"></div>'+
        '</div>');
         $('#CommenterName_'+i)[0].textContent=CurrentComment.authorDisplayName;
         $('#CommenterLikesCount_'+i)[0].textContent=CurrentComment.likeCount;
         $('#CommentText_'+i)[0].textContent=CurrentComment.textDisplay.substring(0,120);
         var dsipDate=new Date(CurrentComment.publishedAt);
         $('#CommentDate_'+i)[0].textContent=dsipDate.toString().substring(4,15);
    }
   
}
PlotAllComments =function(p,CommentTotal)
{
   
    for(var i=0;i<p.length;i++)
    {
        
        var d1=new Date($('#AsOfDateInput').val());
        var d2=new Date(p[i].snippet.topLevelComment.snippet.publishedAt);
       if(d1>d2)
        {
         CommentTotal++;
        CurrentComment=p[i].snippet.topLevelComment.snippet;
         $('#SingleVideoComments').append('<div id="Comment'+i+'" class="CommentsClass">'+
        '<div id="CommenterNameAndLikes_'+i+'"class="CommenterNameAndLikesClass">'+
        '<div id="CommenterName_'+i+'"class="CommenterNameClass"></div>'+
        '<div id="CommenterLikes_'+i+'"class="CommenterLikesClass"><i class="fa fa-thumbs-up"></i><div id="CommenterLikesCount_'+i+'" class="CommenterLikesCountClass"></div></div>'+
        '</div>'+
        '<div id="CommentText_'+i+'"class="CommentTextClass"></div>'+
        '<div id="CommentDate_'+i+'"class="CommentDateClass"></div>'+
         '</div>');
         $('#CommenterName_'+i)[0].textContent=CurrentComment.authorDisplayName;
         $('#CommenterLikesCount_'+i)[0].textContent=CurrentComment.likeCount;
         $('#CommentText_'+i)[0].textContent=CurrentComment.textDisplay.substring(0,120);
         var dsipDate=new Date(CurrentComment.publishedAt);
         $('#CommentDate_'+i)[0].textContent=dsipDate.toString().substring(4,15);
       }
  }
}     
loadVideos=function()
{
 $('#AllVideos').empty();
 var searchquery=$('#searchInputText').val();
 var publishedBeforeDate=new Date($('#AsOfDateInput').val()).toISOString();
 if(publishedBeforeDate==undefined)
 publishedBeforeDate=new Date().toISOString();
 var APIKey='AIzaSyBjGSNm15yAh0grnhBh9CgThANMzZdxnTE'
 var maxResults=8;
 console.log(publishedBeforeDate);
 var url="https://www.googleapis.com/youtube/v3/search?part=snippet&type=''&maxResults="+maxResults+"&publishedBefore="+publishedBeforeDate+"&key="+APIKey+"&q="+searchquery;
fetch(url)
.then((resp) => resp.json())
.then(function(data) 
{
    console.log('Search Results data');
    console.log(data);
    plotAllVideoScreen(data,APIKey,0);

})
.catch(function(error) {
console.log(JSON.stringify(error));
});
}

plotAllVideoScreen1 =function(data,APIKey,trendingFlag)
{
let pictures = data.items;
console.log('Picture ');
console.table(pictures);
var j=0;
for(var i=0;i<pictures.length;i++)
{
if(i==0|| i==4 )
{
    j++;
    $('#AllVideos').append('<div class="card-deck" id="card-group_'+j+'"></div>');

}
var thumbSrc= pictures[i].snippet.thumbnails.high.url;
$('#card-group_'+j).append('<div class="card text-white bg-dark">'
 + '<img  class="card-img-top"  src="'+thumbSrc +'">'
 + '<div class="card-body">'
  +  '<h5 class="card-title">'+pictures[i].snippet.title+'</h5>'
   +' <p class="card-text">'+pictures[i].snippet.description.substring(0,50)+'</p>'
    +'<a href="#" class="btn btn-primary">Go somewhere</a>'
  +'</div></div>');

}
}
