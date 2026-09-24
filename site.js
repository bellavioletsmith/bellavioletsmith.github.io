// Video backdrops: YouTube players, muted + looping, created only when their section is near the viewport.
(function(){
  var holders=[].slice.call(document.querySelectorAll('.video_embed[data-video]'));
  if(!holders.length) return;
  var ready=false, queue=[];
  function make(el){
    if(el.dataset.done) return; el.dataset.done='1';
    var id=el.getAttribute('data-video');
    new YT.Player(el,{
      videoId:id, width:'100%', height:'100%',
      playerVars:{autoplay:1,mute:1,controls:0,loop:1,playlist:id,rel:0,playsinline:1,modestbranding:1,iv_load_policy:3,disablekb:1,fs:0,origin:location.origin},
      events:{
        onReady:function(e){ e.target.mute(); e.target.playVideo(); },
        onStateChange:function(e){ if(e.data===YT.PlayerState.ENDED){ e.target.seekTo(0); e.target.playVideo(); } }
      }
    });
  }
  window.onYouTubeIframeAPIReady=function(){ ready=true; queue.forEach(make); queue=[]; };
  var s=document.createElement('script'); s.src='https://www.youtube.com/iframe_api'; document.head.appendChild(s);
  function want(el){ if(ready) make(el); else if(queue.indexOf(el)<0) queue.push(el); }
  if(!('IntersectionObserver' in window)){ holders.forEach(want); return; }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ var h=e.target.querySelector('.video_embed[data-video]'); if(h) want(h); io.unobserve(e.target); } });
  },{rootMargin:'100% 0px'});
  holders.forEach(function(h){ io.observe(h.closest('.page_container')); });
  // Resume if the browser paused players when the tab was hidden.
  document.addEventListener('visibilitychange',function(){ if(!document.hidden && window.YT){ holders.forEach(function(h){ var p=YT.get&&YT.get(h.id); if(p&&p.playVideo){ p.mute(); p.playVideo(); } }); } });
})();
