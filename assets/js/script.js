window.onload = function () {
  var apiURL = 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=217bef0fd4ea4115bfa59a9378eff2e5';
  new Vue({
    el: '#app',
    data: {
      title: 'Upvote',
      articles: null,
      error: null
    },
    created: function () {
      this.fetchData()
    },
    methods: {
      fetchData: function(){
        var self = this
        $.ajax({
          url: apiURL,
          context: document.body,
          method: "GET",
          beforeSend: function () {
            $('.loading').show();
          },
          complete: function () {
            $(".loading").hide();
          }
        }).done(function(data) {
          if (data.status === 'ok'){
            console.log(data.articles)
            self.articles = data.articles;
            self.articles.forEach(function(article, index){
              article.score = 0;
              article.position = index;
              article.moveOut = false;
              article.moveIn = false;
              article.formatPublishedAt = moment(article.publishedAt).fromNow();
            });
          }else{
            error = {status: 'error', message: 'Oops! Something got wrong, try again later.'};
          }
        }).fail(function(er){
          error = er.responseJSON;
        });
      },
      reorder: function(votedArticle){
        var self = this;
        votedArticle.moveOut = true;
        setTimeout(function () {
          self.articles.sort(function(a, b) {
            return b.score - a.score;
          });
          votedArticle.moveOut = false;
          votedArticle.moveIn = true;
          self.articles.forEach(function(article, index){
            article.position = index;
          });
        }, 200);
      },
      cleanAnimation: function(article){
        this.articles.forEach(function(article) {
          article.moveIn = false;
        })
      },
      up: function(votedArticle){
        var self = this;
        self.cleanAnimation()
        votedArticle.score++;
        votedArticle.author += ' ';
        votedArticle.author = votedArticle.author.trim();

        self.articles.forEach(function(article, index){
          if (article.score < votedArticle.score && index < votedArticle.position){
            self.reorder(votedArticle);
            return;
          }
        });
      },
      down: function(votedArticle){
        var self = this;
        if (votedArticle.score > 0){
          self.cleanAnimation();
          votedArticle.score--;
          votedArticle.author += ' ';

          self.articles.forEach(function(article, index){
            if (article.score > votedArticle.score && index > votedArticle.position){
              self.reorder(votedArticle);
              return;
            }
          });
        }
      }
    }
  });
}
