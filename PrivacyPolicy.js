/*jshint esversion: 6 */

/*
  DSGVO compliant OPT-IN and OPT-OUT way!
  Style: assets/css/privacypolicy.css
  @author Marcel Kempf (marcel@familie-kempf.net)
  @date 09/01/2019
  Copyright (C) 2019 Marcel Kempf - All Rights Reserved
  usage:
    <script src='' data-PPName='Google' data-PPSrc='https://www.googlemaps.de' data-PPInfo='/datenschutz#Google' data-PPAllowed='false'></script>
    <link data-PPSrc='https://www.googlemaps.de'>
    <iframe data-PPSrc='https://www.googlemaps.de'></iframe>
    <span data-PPSrc='https://www.googlemaps.de'></span> //initalize into privacy policy, but don't implement into current page
*/


/**********************************************
  Plugin Management
**********************************************/

var Third_Parties = (function() {

  let sitePlugins     = [];
  let thirdParties    = {};


  (function init() {

    sitePlugins = document.querySelectorAll('[data-PPSrc]');

  })();

  /*
    Look for PrivacyPolicy instance in localStorage
  */
  function storageAlreadyExists() {
    return window.localStorage.getItem('PrivacyPolicy') != null ? true : false;
  }

  function setPlugin(dataset) {
    if(!isOldPlugin(dataset)) {
      if(isPluginNotAccepted(dataset)) dataset.ppallowed = "null";
      thirdParties = Object.assign(thirdParties, { [dataset.ppname] : dataset });
    }
  }

  function getStorage() {
    return JSON.parse(window.localStorage.getItem('PrivacyPolicy')) || [];
  }

  function getPlugin(name) {
    return thirdParties[name];
  }

  function getPluginFromStorage(name) {
    return getStorage[name];
  }

  function isPluginNotAccepted(dataset) {
    return dataset.ppallowed == "null" || dataset.ppallowed == undefined;
  }

  function isOldPlugin(pluginDataset) {
    let activePlugins = [...sitePlugins].map((sp) => sp.dataset)
                                          .filter((dataset) => dataset.ppname == pluginDataset.ppname);
    return (activePlugins.length == 0 ? true : false);
  }



  return {

    /*
      Returns every plugin of the current webpage
    */
    getPlugins: function() {
      return thirdParties;
    },
    /*
      Returns every plugin of the current webpage
    */
    getSitePlugins: function() {
      return sitePlugins;
    },
    /*
      Activates all plugins on the site based on the storage settings
    */
    activatePlugins: function() {
      sitePlugins.forEach(elem => {
        const data = getPlugin(elem.dataset.ppname);
        if(data != undefined) {
          if(data.ppallowed == "true") {
            elem.dataset.ppallowed = true;
            if(elem.tagName != "span")
              if(elem.tagName == "link")
                elem.href = elem.dataset.ppsrc;
              else
                elem.src = elem.dataset.ppsrc;
          } else {
            elem.dataset.ppallowed = false;
            if(elem.tagName != "span")
              if(elem.tagName == "link")
                elem.href = '';
              else
                elem.src = '';
          }
        } else if(elem.tagName != "span" && elem.dataset.ppallowed == "true")
          elem.src = elem.dataset.ppsrc;
      });
    },
    /*
      Load external script from localStorage
      Undefined plugins get added to the varible thirdParties
    */
    loadStorage: function() {
      if(storageAlreadyExists()) {
        Object.getOwnPropertyNames(getStorage()).forEach((keys) => { setPlugin(getStorage()[keys]); });
      } else {
        this.saveToStorage();
        this.loadStorage();
      }
    },
    /*
      Load external script from localStorage
      Undefined plugins get added to the varible thirdParties
    */
    initalizeNewPlugins: function() {
      let newPlugins = [...sitePlugins].map((sp) => sp.dataset)
                                        .filter((dataset) => thirdParties[dataset.ppname] == undefined);
      for(const plugin of newPlugins)
        setPlugin(plugin);
    },
    /*
      Set thirdParties(all external files of current webpage) in localStorage
    */
    saveToStorage: function() {
      window.localStorage.setItem('PrivacyPolicy', JSON.stringify(this.getPlugins()));
    },
    /*
      Turn on plugin in Third-Party
    */
    allow: function(dataset) {
      dataset.ppallowed = "true";
      setPlugin(dataset);
    },
    /*
      Turn off plugin in Third-Party
    */
    disallow: function(dataset) {
      dataset.ppallowed = "false";
      setPlugin(dataset);
    },
    /*
      Toogle Third-Party state in thirdParties
    */
    togglePluginState: function(plName) {
      const dataset = Third_Parties.getPlugins()[plName];
      if(dataset.ppallowed == "false") dataset.ppallowed = "true";
        else dataset.ppallowed = "false";
    },
    /*
      Turn on all plugins in Third-Party
    */
    allowAll: function() {
      for(const plName in Third_Parties.getPlugins()) {
        const dataset = Third_Parties.getPlugins()[plName];
        this.allow(dataset);
      }
    },
    /*
      TRUE, if not asked for permission external source exists
    */
    existsNewThirdParty: function() {
      return [...sitePlugins].map((sp) => sp.dataset.ppname)
                              .filter((name) => thirdParties[name] == undefined).length > 0;
    }

  };



})();


/**********************************************
PrivacyPolicy
**********************************************/

var PrivacyPolicy = (function() {

  const informationText = `<p id='disclamer'>This site uses cookies for analytical purposes and to improve your browsing experience. To learn more, please read our
                                      <a href='/Datenschutz'>privacy policy</a>.
                                      Do you agree to the use of these cookies and the associated processing of your personal data?
                                    </p>
                                  <input type='button' id='settingsPrivacyPolicy' value='Settings'></input>
                                  <input type='button' id='acceptPrivacyPolicy' value='Accept'></input>
                                  <div                 id='settingsPolicyWindow' class='invinsible'></div>`;


  function createSettingsButton() {
    let settingsButton = document.getElementById('settingsPrivacyPolicy');
    let settingsWindow = document.getElementById('settingsPolicyWindow');

    settingsWindow.innerHTML = PrivacyPolicy.listAllPlugins();
    settingsButton.addEventListener('click', () => {
      settingsWindow.classList.toggle('invinsible');
    });
  }

  function createAcceptButton() {
    let acceptButton = document.getElementById('acceptPrivacyPolicy');

    acceptButton.addEventListener('click', () => {
      Third_Parties.activatePlugins();
      Third_Parties.saveToStorage();
      document.getElementById('privacyPolicyWindow').classList.add('invinsible');
      window.location = window.location;
    });
  }


  return {

    createPopUp: function() {
      let privacyWindow = document.getElementById('privacyPolicyWindow') ||
        (function() {
          let con = document.createElement('div');
          con.id = 'privacyPolicyWindow';
          con.innerHTML = informationText;
          document.body.appendChild(con);
          createSettingsButton();
          createAcceptButton();
          document.getElementById('privacyPolicyWindow').classList.add('invinsible');
          return con;
      })();
      privacyWindow.classList.toggle('invinsible');
    },

    listAllPlugins: function() {
      let listedPlugins = '';
      for(const pl in Third_Parties.getPlugins()) {
        const dataset = Third_Parties.getPlugins()[pl];
        const checked = dataset.ppallowed == "true" ? 'checked' : '';
        listedPlugins +=       `<div class='settingsWindowItem'>
                                  <p>${pl}</p>
                                  <a href='${dataset.ppinfo}'>Info</a>
                                    <label class="switch">
                                      <input type="checkbox" ${checked} onClick="Third_Parties.togglePluginState('${pl}')">
                                      <span class="slider round"></span>
                                    </label>
                                  </div><br>`;
      }
      return listedPlugins;
    },


    init: function() {
      if (typeof(Storage) !== "undefined") {

        Third_Parties.loadStorage();
        Third_Parties.activatePlugins();

        if(Third_Parties.existsNewThirdParty()) {
          Third_Parties.initalizeNewPlugins();
          Third_Parties.allowAll();
          PrivacyPolicy.createPopUp();
        }

      } else alert("Your browser doesn't support local storage! Update your browser to a compatible HTML5 version!");
    }

  };

})();

PrivacyPolicy.init();



function loadGMaps() {
  var gmegMap, gmegMarker, gmegInfoWindow, gmegLatLng;

  google.maps.event.addDomListener(window, "load", function() {
    gmegLatLng = new google.maps.LatLng(52.51845, 13.3737497);
    gmegMap = new google.maps.Map(document.getElementById("gmeg_map_canvas"), {
      zoom: 14,
      center: gmegLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    gmegMarker = new google.maps.Marker({
      map: gmegMap,
      position: gmegLatLng
    });
    gmegInfoWindow = new google.maps.InfoWindow({
      content: '<b>Federal Parliament Berlin</b><br>Platz der Republik 1, 11011 Berlin'
    });
    gmegInfoWindow.open(gmegMap, gmegMarker);
  });
}
