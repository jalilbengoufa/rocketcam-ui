new Vue({

    el: '#root',
    data: {

        logs: [],
        interval: null,
    },
    methods: {

        loadLogs: function() {
            var self = this;

            setInterval(function() {
                fetch('http://localhost:8000/')
                    .then(function(response) {
                        return response.json()
                    }).then(function(json) {
                        self.logs.push(json.toString());
                    }).catch(function(ex) {
                        console.log('parsing failed', ex)
                    })
            }.bind(this), 3000);

        }
    },

    beforeDestroy: function() {
        clearInterval(this.interval);
    }


});

/*               console.log(json.toString()),*/