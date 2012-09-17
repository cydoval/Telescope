(function(){

  commentIsNew=function(comment){
    var d=new Date(comment.submitted);
    var commentIsNew=d > window.newCommentTimestamp;
    // console.log("body: "+comment.body+" | comment submission date: "+d+" |  newCommentTimestamp: "+window.newCommentTimestamp+" | isNew: "+commentIsNew);
    return commentIsNew;
  };

  findQueueContainer=function($comment){
    // go up and down the DOM until we find either A) a queue container or B) an unqueued comment
    $up=$comment.prevAll(".queue-container, .comment-displayed").first();
    $down=$comment.nextAll(".queue-container, .comment-displayed").first();
    $queuedAncestors=$comment.parents(".comment-queued");

    if($queuedAncestors.exists()){
      console.log("----------- case 1 -----------");
      // 1. 
      // our comment has one or more queued ancestor, so we look for the root-most
      // ancestor's queue container
      $container=$queuedAncestors.last().data("queue");
    }else if($up.hasClass("queue-container")){
      console.log("----------- case 2 -----------");
      // 2. 
      // we've found a container on the same level above our comment, so we use it to store our queue
      $container=$up;
    }else if($down.hasClass("queue-container")){
      console.log("----------- case 3 -----------");
      // 3. 
      // we've found a container on the same level below our comment, so we use it to store our queue
      $container=$down;
    }else if($up.hasClass('comment-displayed') || !$up.exists()){
      console.log("----------- case 4 -----------");
      // 4. 
      // we've found containers neither above or below, but 
      // A) we've hit a displayed comment or
      // B) we've haven't found any comments (i.e. we're at the beginning of the list)
      // so we put our queue container just before the comment
      $container=$('<div class="queue-container"><ul></ul></div>').insertBefore($comment);
      $container.click(function(){
        $(this).find("a").each(function(){
          var target=$(this).attr("href");
          console.log("target: ", target);
          $(target).removeClass("comment-queued").addClass("comment-displayed");
        });
        $(this).hide("slow").remove();
      });
    }
    console.log("comment", $comment);
    console.log("up", $up);
    console.log("down", $down);
    console.log("queuedAncestors", $queuedAncestors);
    console.log("container", $container);
    return $container;
  };


Template.comment_item.rendered=function(){
  t("comment_item");
  if(this.data){
    var comment=this.data;
    var $comment=$("#"+comment._id);

    if(false && Meteor.user() && Meteor.user()._id==comment.user_id){
      // if user is logged in, and the comment belongs to the user, then never queue it
    }else{
      if(commentIsNew(comment) && !$comment.hasClass("comment-queued")){
        // if comment is new and has not already been previously queued
        // note: testing on the class works because Meteor apparently preserves newly assigned CSS classes
        // across template renderings
        // TODO: save scroll position
        if(Meteor.users.findOne(comment.user_id)){
          // get comment author name
          var author=Meteor.users.findOne(comment.user_id).username;
        }
        var $container=findQueueContainer($comment);
        var comment_link='<li class="icon-user"><a href="#'+comment._id+'" class="has-tooltip"><span class="tooltip"><span>'+author+'</span></span></a></li>';
        $(comment_link).appendTo($container.find("ul")).hide().fadeIn("slow");
        $comment.removeClass("comment-displayed").addClass("comment-queued");
        $comment.data("queue", $container);
        console.log("data on:", $comment);
        console.log("data1", $.data($comment));
        // TODO: take the user back to their previous scroll position
      }
    }
  }
}


  Template.comment_item.events = {
    'click .goto-comment': function(event){
      event.preventDefault();
      var href=event.target.href.replace(/^(?:\/\/|[^\/]+)*\//, "");

      Session.set('selected_comment', this);
      // Session.set('state', 'reply');
      Router.navigate(href, {trigger: true});
    },
    'click .open-comment-link': function(e){
      e.preventDefault();
      $(event.target).closest(".comment").removeClass("queued");
    },
    'click .queue-comment': function(e){
      e.preventDefault();
      var current_comment_id=$(event.target).closest(".comment").attr("id");
    var now = new Date();
    console.log("now: ", now.toString());   
    var comment_id = Comments.update(current_comment_id,
        {
          $set: {
            submitted:  new Date().getTime()
          }
        }
      );
      // $(event.target).closest(".comment").addClass("queued");
    }
  };

  Template.comment_item.full_date = function(){
    var submitted = new Date(this.submitted);
    return submitted.toString();
  };

  Template.comment_item.child_comments = function(){
    var post_id = Session.get('selected_post_id');
    var comments = Comments.find({ post: post_id, parent: this._id });
    return comments;
  };

  Template.comment_item.author = function(){
    if(Meteor.users.findOne(this.user_id)){
      return Meteor.users.findOne(this.user_id).username;
    }
  };

  Template.comment_item.is_my_comment = function(){
    if(this.user_id && Meteor.user() && Meteor.user()._id==this.user_id){
      return true;
    }
    return false;
  };

  Template.comment_item.body_formatted = function(){
    if(this.body){
      var converter = new Markdown.Converter();
      var html_body=converter.makeHtml(this.body);
      return html_body.autoLink();
    }
  }
})();


Template.comment_item.helpers({
  // isQueued: function() {
  //   commentIsNew(this);
  // },
  repress_recursion: function(){
    if(window.repress_recursion){
      return true;
    }
    return false;
  },
  ago: function(){
    var submitted = new Date(this.submitted);
    var timeAgo=jQuery.timeago(submitted);
    return timeAgo;
  }
});