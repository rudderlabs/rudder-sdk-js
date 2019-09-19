function HubspotAnalyticsManager(hubId) {
  this.hubId = hubId
  this.init = function(){
    if(typeof window !== undefined){
      
      /* $.getScript("https://js.hs-scripts.com/"+this.hubId+".js").done(function() {
        var id = setInterval(function () {
          if(!!(window._hsq && (window._hsq.push !== Array.prototype.push))) {
              console.log("window hsq = " ,  window._hsq);
              clearInterval(id)
          } else{
            return 1
          }
        }, 3000)

      }); */
      $.ajax({
        async: false,
        url: "https://js.hs-scripts.com/"+this.hubId+".js",
        dataType: "script"
      });
      console.log("===in constructor===");
    }
    return {
      identify : identify,
      track: track,
      page: page
    }
  }
    function identify(rudderElement) {
      console.log("in HubspotAnalyticsManager identify");
      /* rudderElement = {
        rl_message: {
          rl_context: {
            rl_traits: {
              rl_name: 'prabrisha',
              rl_age: 32,
              rl_email: 'prabrisha@gmail.com',
              rl_address: {
                rl_city: 'west bengal',
                rl_street: 'Subratapally',
                country: 'india',
                postalcode: '712221'
              }
            }
          }
        } 
      } */
      
      var traits = rudderElement.rl_message.rl_context.rl_traits
      var traitsValue = {}

      for(k in traits){
        if(traits.hasOwnProperty(k)){
          if(traits[k]){
            var hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
            traitsValue[hubspotkey] = traits[k]
          }
          
        }
      }
      if(traitsValue['address']){
        var address = traitsValue['address']
        //traitsValue.delete(address)
        delete traitsValue['address']
        for(k in address){
          if(address.hasOwnProperty(k)){
            if(address[k]){
              var hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
              hubspotkey = (hubspotkey == 'street') ? 'address' : hubspotkey
              traitsValue[hubspotkey] = address[k]
            }
            
          }
        }
      }
      var userProperties = rudderElement.rl_message.rl_context.rl_user_properties
      for(k in userProperties){
        if(userProperties.hasOwnProperty(k)){
          if(userProperties[k]){
            var hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
            traitsValue[hubspotkey] = userProperties[k]
          }
          
        }
      }

      console.log(traitsValue);

      if(typeof window !== undefined){
        var _hsq = window._hsq = window._hsq || [];
        _hsq.push(["identify", traitsValue]);
      }
      
    }
  
    function track(rudderElement) {
      console.log("in HubspotAnalyticsManager track");
      var _hsq = window._hsq = window._hsq || [];
      var eventValue = {}
      eventValue['id'] = rudderElement.rl_message.rl_event
      if(rudderElement.rl_message.rl_properties && rudderElement.rl_message.rl_properties.revenue){
        console.log("revenue: " + rudderElement.rl_message.rl_properties.revenue);
        eventValue['value'] = rudderElement.rl_message.rl_properties.revenue
      }
      _hsq.push(["trackEvent", eventValue]);
    }
  
    function page(rudderElement) {
      console.log("in HubspotAnalyticsManager page");
      var _hsq = window._hsq = window._hsq || [];
      console.log('path: ' + rudderElement.rl_message.rl_properties.path);
      _hsq.push(['setPath', rudderElement.rl_message.rl_properties.path]);
      _hsq.push(['trackPageView']);
    }
  }
  var hb
  function initHubSpot(hubId){//6405167
    hb = hb || new HubspotAnalyticsManager(hubId)
    return hb
  }
  