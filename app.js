new Vue({

    el: '#root',
    data: {

        logs: []
    },
    mounted() {





      

    },
    methods:{


    	loadLogs:function(){
    			axios.get('http://project.test/connect').then(response =>

                this.logs.push(response.data));

    	}.bind(this);
    }
});