window.onload = function () {
  var apiURL = 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=217bef0fd4ea4115bfa59a9378eff2e5';
  var app = new Vue({
    el: '#app',
    data: {
      title: 'Upvote!',

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
          }else{
            error = {status: 'error', message: 'Oops! Something got wrong, try again later.'};
          }
        }).fail(function(er){
          error = er.responseJSON;
        });
      }
    }
  });
}
