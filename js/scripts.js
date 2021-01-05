var blog = blog || {};
blog.api = blog.api || (function() {
    // selector to highlight active nav link
    var _linkSelector = "ul li.link-primary";
    // static initial posts
    var _posts = [
          {
            "id": 1609819506000,
            "text": "Thisisthecontentofmyblogpost.",
            "timestamp": 1609819506000,
            "title": "TheTitleofMyBlogPost"
          },
          {
            "id": 1609815906000,
            "text": "Deardiary,todayImetafishwhocouldtalk.",
            "timestamp": 1609815906000,
            "title": "AWeirdThingHappened..."
          }
        ];
    // manage active nav link
    $(_linkSelector).on('click', function() {
        $(_linkSelector).removeClass('active');
        $(this).addClass('active');
    })
    var _showAllPosts = function (templateId) {
        var successCallback = function (posts) {
            renderPosts(posts, templateId);
            _posts = posts;
            console.log(_posts);
        };
        performAjaxAction(successCallback);
    };
    var _showPost = function (postId) {
        var post = _posts.filter(function(post){return post.id.toString() === postId})[0];
        renderPosts([post]);
    }
    var _openCreatePostModal = function() {
        var markup = compileHandlebarTemplate("create-post-template");
        var context = {};
        var theCompiledHtml = markup(context);
        $("#modal-container").html(theCompiledHtml);
        $('#myModal').modal('show');
    }
    var _openEditPostModal = function(postId) {
        var markup = compileHandlebarTemplate("edit-post-template");
        var post = _posts.filter(function(post){return post.id.toString() === postId})[0];
        var theCompiledHtml = markup(post);
        $("#modal-container").html(theCompiledHtml);
        $('#myModal').modal('show');
    }
    var _openDeleteModal = function(postId) {
        var markup = compileHandlebarTemplate("delete-post-template");
        var post = _posts.filter(function(post){return post.id.toString() === postId})[0];
        var theCompiledHtml = markup(post);
        $("#modal-container").html(theCompiledHtml);
        $('#myModal').modal('show');
    }
    var _createPost = function () {
        var newPost = {};
        var options = {};
        newPost.title = $("#postTitle").val();
        newPost.text= $("#postDescription").val();
        newPost.timestamp = new Date().getTime();
        newPost.id = newPost.timestamp;
        options.method = "POST";
        options.data = newPost;
        var createCallback = function (posts) {
            renderPosts(posts);
            $('#myModal').modal('hide');
        };
        performAjaxAction(createCallback, options);
    };
    var _updatePost = function (postId) {
        var updatePost = {};
        var options = {};
        updatePost.title = $("#postTitle").val();
        updatePost.text= $("#postDescription").val();
        updatePost.timestamp = new Date().getTime();
        updatePost.id = postId;
        options.method = "POST";
        options.data = updatePost;
        var createCallback = function (posts) {
            renderPosts(posts);
            $('#myModal').modal('hide');
        };
        performAjaxAction(createCallback, options);
    };
    var _deletePost = function (postId) {
        var options = {data: {deleteAll: false}};
        options.method = "DELETE";
        if(postId) {
            options.data.postId = postId;
        } else {
            options.data.deleteAll = true;
        }
        var createCallback = function (posts) {
            renderPosts(posts);
            $('#myModal').modal('hide');
        };
        performAjaxAction(createCallback, options);
    };
    var _deleteAllPosts = function () {
        _deletePost();
        $('#deleteAllModal').modal('hide');
    }
    function compileHandlebarTemplate(templateId) {
        return Handlebars.compile($("#" + templateId).html());
    }
    function performAjaxAction(successCallback, options = {method: 'GET'}) {
        if(options.method === 'POST') {
            var postIndex = _posts.findIndex(function(post){return post.id.toString() === options.data.id.toString()})
            if(postIndex > -1 ) {
                _posts.splice(postIndex, 1, options.data);
            } else {
                _posts.push(options.data);
            }
        } else if(options.method === 'DELETE') {
            if(options.data.deleteAll) {
                _posts = [];
            } else {
                var postIndex = _posts.findIndex(function(post){return post.id.toString() === options.data.postId.toString()});
                _posts.splice(postIndex, 1);
            }
        }
        successCallback && successCallback.call({}, _posts); 
    }
    function renderPosts(posts, templateId = "show-posts") {
        var _posts = formatPosts(posts);
        _posts.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });
        var markup = compileHandlebarTemplate(templateId);
        var context = { blog: _posts };
        var theCompiledHtml = markup(context);
        $('#posts-container').html(theCompiledHtml);
    }

    function formatPosts(posts) {
        for (var key in posts) {
            var post = posts[key]
            if (post) {
                if (post.timestamp) post.timestamp = new Date(post.timestamp);
            }
        }
        return posts;
    }

    return {
        showAllPosts: _showAllPosts,
        showPost: _showPost,
        openCreatePostModal: _openCreatePostModal,
        createPost: _createPost,
        openEditPostModal: _openEditPostModal,
        updatePost: _updatePost,
        openDeleteModal: _openDeleteModal,
        deletePost: _deletePost,
        deleteAllPosts: _deleteAllPosts
    }
})();


blog.api.showAllPosts();