new Vue({

    el: '#root',
    data: {
        url: 'https://cedille.localtunnel.me/',
        logs: [],
        verifyConnection: null,
        timeout: 0,
    },
    methods: {
        connnexion: function() {
            var self = this;
            console.log(self.url)
            fetch(self.url).then(function(response) {
                    return response.json();
                }).then(function(json) {
                    if (json.connected == true) {
                        self.logs.push('Connected to the Rocket!' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                    }
                }).catch(function(ex) {
                    self.logs.push('Can not connect to the rocket , try again' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                    console.log('parsing failed', ex);
                  
                })
        },
        start: function() {
            var self = this;

            fetch(self.url + 'start')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    if (json.running == true) {
                        self.logs.push('Recording started !' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                    }
                }).catch(function(ex) {
                    console.log('parsing failed', ex);
                });

            //fetch in interval to verify the connection
            self.verifyConnection = setInterval(function() {
                fetch(self.url)
                    .then(function(response) {
                        return response.json()
                    }).then(function(json) {
                        if (json.running == false) {
                            self.timeout++;
                        }
                        if (self.timeout == 3) {
                            self.logs.push('The camera stopped running , please reload the page and try again' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                            self.beforeDestroy();
                            self.timeout = 0;
                        }
                        if (self.logs.length == 15) {
                            self.logs.splice(0, 13)
                        }
                    }).catch(function(ex) {
                        self.logs.push('Connection lost please reload the page and try again' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                        console.log('parsing failed', ex.toString())
                        self.beforeDestroy();
                    })
            }.bind(this), 5000);

        },
        stop: function() {
            var self = this;
            fetch(self.url + 'stop')
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                    if (json.running == false) {
                        self.logs.push('Recording has been stopped !' + " [ " + new Date().toLocaleTimeString() + "   " + new Date().toLocaleDateString() + "  ]");
                    }
                }).catch(function(ex) {
                    console.log('parsing failed', ex.toString());
                });
        },
        beforeDestroy: function() {
            var self = this;
            clearInterval(self.verifyConnection);
        }
    }

});