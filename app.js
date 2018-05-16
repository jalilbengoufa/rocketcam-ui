//url : http://dangerous-monkey-85.localtunnel.me/
new Vue({

    el: '#root',
    data: {
        url : 'http://localhost:8000/',
        logs: [],
        interval: null,
    },
    methods: {

        loadLogs: function() {
            var self = this;
            //verify connection
            fetch(self.url)
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                   /* if (json.connected == true)
                        self.logs.push('Connected to the Rocket'+ "    " + new Date())*/
                       self.logs.push(json.toString() + " [ "+ new Date().toLocaleTimeString()+"   "+ new Date().toLocaleDateString()+"  ]"); 
                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                })

            //fetch in interval to verify the connection
            setInterval(function() {
                fetch(self.url)
                    .then(function(response) {
                        return response.json()
                    }).then(function(json) {
                        if (json.running== false) {
                            self.logs.push('not connected' + "    " + new Date());
                        }
                        if (self.logs.length == 10) {
                            self.logs.splice(0, 8)
                        }
                    }).catch(function(ex) {
                        console.log('parsing failed', ex)
                    })
            }.bind(this), 1000);

        },

        start: function() {
            var self = this;
            fetch(self.url +'start')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {

                    self.logs.push(json.toString() + "    " + new Date());

                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });

        },
        stop: function() {
            var self = this;
            fetch(self.url+'stop')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {

                    self.logs.push(json.toString() + "    " + new Date());

                }).catch(function(ex) {
                    console.log('parsing failed', ex)
                });
        },
        beforeDestroy: function() {
            clearInterval(this.interval);
        }
    }


});