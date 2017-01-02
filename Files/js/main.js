var gw2_api_url = 'https://api.guildwars2.com/v2',
    lbm_api_url = 'http://waldolf.fr/overlay',
    lbm_ts_url = 'ts.lebusmagique.fr';

function setConfig(key, value){
  if(typeof(value) !== 'string') {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
  return;
};

function getConfig(key) {
  return localStorage.getItem(key);
};

function deleteConfig(key) {
  if(getConfig(key)) {
    localStorage.removeItem(key);
  }
};

function resetConfig() {
  deleteConfig('api_key');
  deleteConfig('permissions');
  deleteConfig('account_name');
  deleteConfig('account_id');
  deleteConfig('high_level');
  deleteConfig('account_access');
  deleteConfig('favorite_guild');
  deleteConfig('guilds');
};

function setOpacity() {
  var opacity = getConfig('opacity');
  $('html').removeClass('opacity-15').removeClass('opacity-25').removeClass('opacity-50').removeClass('opacity-75');
  if(opacity) {
    $('html').addClass('opacity-'+opacity);
  } else {
    $('html').addClass('opacity-15');
  }
};

function dragResize(edge){
	overwolf.windows.getCurrentWindow(function(result){
		if (result.status=="success"){
			overwolf.windows.dragResize(result.window.id, edge);
		}
	});
};

function dragMove(){
  overwolf.windows.getCurrentWindow(function(result){
    if (result.status=="success"){
      overwolf.windows.dragMove(result.window.id);
    }
  });
};

function closeWindow(){
  overwolf.windows.getCurrentWindow(function(result){
    if (result.status=="success"){
      overwolf.windows.close(result.window.id);
    }
  });
};

function copyToClipboard(data) {
  overwolf.utils.placeOnClipboard(data);
};

function loadTeamspeakBtn() {
  if(getConfig('account_name')) {
    var representation = '[]';
    if(getConfig('favorite_guild')) {
      representation = '[' + getConfig('favorite_guild') + ']';
    }
    $('header a#config').before('<a href="ts3server://'+lbm_ts_url+'/?nickname='+ representation + ' ' + getConfig('account_name') +'" target="_blank" id="teamspeak"><i class="fa fa-microphone" aria-hidden="true"></i></a>');
  }
};

(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

function add_class_has_scrollbar() {
  if($('#page').hasScrollBar()) {
    $('#page').addClass('scrollbar');
  } else {
    $('#page').removeClass('scrollbar');
  }
};

function loadPage(page) {

  var d1 = new Date();
  var d2 = new Date(); d2.setDate(d2.getDate() + 1); d2.setHours(1); d2.setMinutes(0); d2.setSeconds(0);
  var d3 = d2 - d1;
  var MINUTE_IN_MS = 60000;
  var HOUR_IN_MS = MINUTE_IN_MS * 6;
  var prev_refresh = getConfig('refresh');

  if(prev_refresh) {
    clearInterval(prev_refresh);
  }

  $('#page .container').html('<i class="fa fa-spinner fa-pulse fa-fw"></i> Chargement en cours...');

  if(page == 'guild-motd') {
    loadMotd(); var refresh = setInterval(function(){ loadPage(page); }, MINUTE_IN_MS*5);
  } else if(page == 'guild-stash') {
    loadStash(); var refresh = setInterval(function(){ loadPage(page); }, MINUTE_IN_MS*5);
  } else if(page == 'last-news') {
    loadNews(); var refresh = setInterval(function(){ loadPage(page); }, HOUR_IN_MS);
  } else if(page == 'last-pages') {
    loadPages(); var refresh = setInterval(function(){ loadPage(page); }, HOUR_IN_MS);
  } else if(page == 'next-events') {
    loadEvents(); var refresh = setInterval(function(){ loadPage(page); }, HOUR_IN_MS*4);
  } else if(page == 'daily-pve') {
    loadAchievementsDaily('pve'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-pvp') {
    loadAchievementsDaily('pvp'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-wvw') {
    loadAchievementsDaily('wvw'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-special') {
    loadAchievementsDaily('special'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-fen') {
    loadAchievementsCategory(142, 'fen'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-bay') {
    loadAchievementsCategory(145, 'bay'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-frontier') {
    loadAchievementsCategory(149, 'frontier'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-fractals') {
    loadAchievementsCategory(88, 'fractals'); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'daily-crafts') {
    loadDailyCrafts(); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'pact-agents') {
    loadPactAgents(); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'config') {
    loadConfig(); var refresh = 0;
  } else if(page == 'timers') {
    loadTimers(); var refresh = setInterval(function(){ loadPage(page); }, MINUTE_IN_MS*5);
  }

  setConfig('refresh', refresh);
  setOpacity();

};

function loadMotd() {
  $.getJSON(lbm_api_url+'/?data=guild', function(data) {
    var motd = data.motd;
    data.motd = motd.replace(/\n/g, "<br />");
    var source = $("#guild-motd-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
  });
};

function loadNews() {
  $.getJSON(lbm_api_url+'/?data=news', function(data) {
    var source = $("#news-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
  });
};

function loadPages() {
  $.getJSON(lbm_api_url+'/?data=pages', function(data) {
    var source = $("#pages-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
  });
};

function loadStash() {
  $.getJSON(lbm_api_url+'/?data=stash', function(data) {
    var source = $("#guild-stash-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
  });
};

function loadEvents() {
  $.getJSON(lbm_api_url+'/?data=events', function(data) {
    var source = $("#next-events-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
    });
};

function loadAchievementsDaily( type ) {
  $.getJSON(gw2_api_url+'/achievements/daily', function(data) {

    var list = [];
    var names = [],
        requirements = [],
        icons = [],
        achievements = [],
        tiers = [];

    $.each(data, function(i, j) {
      $.each(j, function(k, l) {
        list.push(l.id);
      });
    });

    var ids = list.join(',');
    var high_level = getConfig('high_level');
    var account_access = getConfig('account_access');

    $.getJSON(gw2_api_url+'/achievements?lang=fr&ids='+ids, function(d) {
      $.each(d, function(m, n) {
          names[n.id] = n.name;
          requirements[n.id] = n.requirement;
          icons[n.id] = n.icon;
          tiers[n.id] = n.tiers;
      });

      $.each(data, function(i, j) {
        $.each(j, function(k, l) {
          var id = data[i][k]['id'];
          data[i][k]['name'] = names[id];
          data[i][k]['icon'] = icons[id];
          data[i][k]['requirement'] = requirements[id];
          var quantity = requirements[id].match(/\s\s+/ig);
          if(quantity) {
            $.each(quantity, function(qk, qv) {
              data[i][k]['requirement'] = data[i][k]['requirement'].replace(/\s\s+/, ' ' + tiers[id][qk]['count'] + ' ');
            });

          }
          data[i][k]['tip'] = tips[id];
          if(tips[id]) {
            var mask = tips[id].mask,
                btn = tips[id].btn;
            if(typeof(tips[id].link_url) !== 'undefined') {
              var link_url = tips[id].link_url.replace('%lbm%', 'http://www.lebusmagique.fr/pages').replace('%yt%', 'https://youtu.be').replace('%wiki%', 'https://wiki-fr.guildwars2.com/wiki');
            }
                var link_title = tips[id].link_title,
                tip = mask.replace("%btn%", "<button onclick=\"copyToClipboard('"+btn+"')\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i> "+btn+"</button>").replace("%link%", "<a href=\""+link_url+"\" target=\"_blank\">"+link_title+"</a>");

            data[i][k]['tip'] = tip;
          }

          if(high_level) {
            if(high_level >= data[i][k].level.min && high_level <= data[i][k].level.max) {
              data[i][k]['display_level'] = 'level-show';
            } else {
              data[i][k]['display_level'] = 'level-hide';
            }
          }

          if(account_access) {
            var required_access = data[i][k].required_access;

            if(required_access.indexOf(account_access) >= 0) {
              data[i][k]['display_access'] = 'access-show';
            } else {
              data[i][k]['display_access'] = 'access-hide';
            }
          }

        });
      });

      achievements['achievements'] = data[type];


      if(type == 'pve') {
        achievements['title'] = 'Succès JcE quotidien';
      } else if(type == 'pvp') {
        achievements['title'] = 'Succès JcJ quotidien';
      } else if(type == 'wvw') {
        achievements['title'] = 'Succès McM quotidien';
      } else if(type == 'special') {
        achievements['title'] = 'Succès spéciaux quotidien';
      }

      var source   = $("#daily-tpl").html();
      var template = Handlebars.compile(source);
      var html    = template(achievements);
      $('#page .container').html(html);

      achievements_done();

    });

  });
};

function loadAchievementsCategory(catid, catname) {

  $.getJSON(gw2_api_url+'/achievements/categories/'+catid+'?lang=fr', function(data) {

    var list = data.achievements;
    var icon = data.icon;
    var title = data.name;
    var data = [];

    var ids = list.join(',');

    $.getJSON(gw2_api_url+'/achievements?lang=fr&ids='+ids, function(d) {
      $.each(d, function(m, n) {
        if(typeof(n.icon) !== "undefined") {
          icon = n.icon;
        }
          data[m] = { "id":  n.id, "name": n.name.replace('Fractale quotidienne', 'Fractale').replace(/Niveau\s(\d)\squotidien/g, 'Niv. $1'), "icon": icon, "requirement": n.requirement };
          if(tips[n.id]) {
            var mask = tips[n.id].mask,
                btn = tips[n.id].btn;
            if(typeof(tips[n.id].link_url) !== 'undefined') {
              var link_url = tips[n.id].link_url.replace('%lbm%', 'http://www.lebusmagique.fr/pages').replace('%yt%', 'https://youtu.be').replace('%wiki%', 'https://wiki-fr.guildwars2.com/wiki');
            }
            var link_title = tips[n.id].link_title,
                tip = mask.replace("%btn%", "<button onclick=\"copyToClipboard('"+btn+"')\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i> "+btn+"</button>").replace("%link%", "<a href=\""+link_url+"\" target=\"_blank\">"+link_title+"</a>");
            data[m]['tip'] = tip;
          }
      });

      data = {"category": data, "id": catid, "title": title};

      var source   = $("#daily-category-tpl").html();
      var template = Handlebars.compile(source);
      var html    = template(data);
      $('#page .container').html(html);

      achievements_done();

    });

  });

};

function loadDailyCrafts() {
  $.getJSON(lbm_api_url+'/?data=daily-crafts', function(data) {
    var source = $("#daily-crafts-tpl").html();
    var template = Handlebars.compile(source);
    var html = template(data, {data: {intl: intlData}});
    $('#page .container').html(html);
    achievements_done();
  });
};

function loadPactAgents() {

  var agents = [
    [ // Dimanche
      {"map": "Ascalon", "waypoint": "Point de passage du Camp de la Crête de neige", "chat_code": "[&BCECAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Point de passage de la Lumière froide", "chat_code": "[&BIUCAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Camp de Maraifangeux", "chat_code": "[&BC0AAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Point de passage de Fort Trinité", "chat_code": "[&BO4CAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Point de passage de Mabon", "chat_code": "[&BDoBAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Tonnelle d'Azarr", "chat_code": "[&BIkHAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Lundi
      {"map": "Ascalon", "waypoint": "Pointe d'Haymal", "chat_code": "[&BA8CAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Camp de la crête rocheuse", "chat_code": "[&BIMCAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Collines de portage", "chat_code": "[&BKYBAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Point de passage du Ralliement", "chat_code": "[&BNIEAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Point de passage du dépôt de la garde du lion", "chat_code": "[&BEwDAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Refuge de restauration", "chat_code": "[&BIcHAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Mardi
      {"map": "Ascalon", "waypoint": "Point de passage du Point de Temperus", "chat_code": "[&BIMBAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Point de passage de Travelen", "chat_code": "[&BGQCAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Garenhoff", "chat_code": "[&BBkAAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Point de passage des Crevasses oubliées", "chat_code": "[&BKgCAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Point de passage de Desider Atum", "chat_code": "[&BEgAAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Point de passage du Camp de la détermination", "chat_code": "[&BH8HAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Mercredi
      {"map": "Ascalon", "waypoint": "Village de Ferrusatos", "chat_code": "[&BPEBAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Mennerheim", "chat_code": "[&BDgDAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Point de passage de Chimèrepavois", "chat_code": "[&BKYAAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Mande-Ombre de Caer", "chat_code": "[&BP0CAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Guet de Gardemarais", "chat_code": "[&BMIBAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Ville de Prospérité", "chat_code": "[&BH4HAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Jeudi
      {"map": "Ascalon", "waypoint": "Point de passage des Ruines de Piken la vieille", "chat_code": "[&BOQBAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Antreroche", "chat_code": "[&BF0GAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Comptoir de l'Autel du Ruisseau", "chat_code": "[&BIMAAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Point de passage de Fort Trinité", "chat_code": "[&BO4CAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Protecteurs séraphins", "chat_code": "[&BE8AAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Oasis bleue", "chat_code": "[&BKsHAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Vendredi
      {"map": "Ascalon", "waypoint": "Point de passage des Portails du faucon", "chat_code": "[&BNMAAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Point de passage du Col du dolyak", "chat_code": "[&BHsBAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Point de passage de l'Ilot de perles", "chat_code": "[&BNUGAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Point de passage des Crevasses oubliées", "chat_code": "[&BKgCAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Point de passage du Barde", "chat_code": "[&BMwCAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Atelier de réparation", "chat_code": "[&BJQHAAA=]", "name": "Mehem le Voyageur"},
    ],
    [ // Samedi
      {"map": "Ascalon", "waypoint": "Domaine de Bovarin", "chat_code": "[&BBABAAA=]", "name": "Verma Broyedon"},
      {"map": "Cimefroides", "waypoint": "Balddistead", "chat_code": "[&BEICAAA=]", "name": "Despina Katelyn"},
      {"map": "Kryte", "waypoint": "Point de passage du Fort des Veilleurs", "chat_code": "[&BJIBAAA=]", "name": "Dame Derwena"},
      {"map": "Orr", "waypoint": "Torche d'Augur", "chat_code": "[&BBEDAAA=]", "name": "Spécialiste Yana"},
      {"map": "Jungle de Maguuma", "waypoint": "Folie du Brave", "chat_code": "[&BLkCAAA=]", "name": "Le renard"},
      {"map": "Contrées sauvages de Maguuma", "waypoint": "Point de passage du Camp de la détermination", "chat_code": "[&BH8HAAA=]", "name": "Mehem le Voyageur"},
    ]
  ];

  var today = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  var date = new Date();
  var data = {"today": today[date.getDay()], "agents": agents[date.getDay()]};

  var source   = $("#pact-agents-tpl").html();
  var template = Handlebars.compile(source);
  var html    = template(data);
  $('#page .container').html(html);

};





































var cookieName = "LBM_WB_CHKBX";
var cookieSeparator = '_';
Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }

function countdown(id) {

	var currentDate = new Date();
	var $event = $('#events #event-'+id);
	var hours = $event.children('.start').html().split(':');
	var eventDate = new Date();
		eventDate.setHours(hours[0], hours[1], 0);

	if (eventDate < currentDate) {
		eventDate.setTime(eventDate.getTime() + (24*60*60*1000));
	}

	var hoursCD, minutesCD, secondsCD;
	var secondsToEvent = (eventDate.getTime() - currentDate.getTime()) / 1000;
	hoursCD = parseInt(secondsToEvent / 3600);
	secondsToEvent = secondsToEvent % 3600;
	minutesCD = parseInt(secondsToEvent / 60);
	secondsCD = parseInt(secondsToEvent % 60);

	$event.children('.countdown').html(hoursCD.pad() + ':' + minutesCD.pad() + ':' + secondsCD.pad());

	if($event.hasClass('current')) {
		$event.children('.countdown').html('en cours');
	} else {
		$event.children('.countdown').html(hoursCD.pad() + ':' + minutesCD.pad() + ':' + secondsCD.pad());
	}

	setTimeout(countdown, 1000, id);
};

function highlightRow(idPreviousRow){

	var date = new Date();
	var h = date.getHours();

	var roundto5 = 1000 * 60 * 5;
	var rounded = new Date(Math.round(date.getTime() / roundto5) * roundto5);
	var m = rounded.getMinutes();

	var id = h.pad() + "" + m.pad();
	console.log('"'+id+'"');

	if (idPreviousRow != null && idPreviousRow != id) {
		$('#events .event[data-time="'+idPreviousRow+'"]').removeClass('current');
	}
	if (idPreviousRow == null || idPreviousRow != id) {

		if($('#events .event[data-time="'+id+'"]').length) {
			//console.log('condi-1');
			$('#events .event[data-time="'+id+'"]').addClass('current');
		}else if($('#events .event[data-time="'+(id-5)+'"]').length) {
			//console.log('condi-2');
			$('#events .event[data-time="'+(id-5)+'"]').addClass('current');
			id = id-5;
		}else if($('#events .event[data-time="'+(id-10)+'"]').length) {
			//console.log('condi-3');
			$('#events .event[data-time="'+(id-10)+'"]').addClass('current');
			id = id-10;
		}else if($('#events .event[data-time="'+(id-15)+'"]').length) {
			//console.log('condi-4');
			$('#events .event[data-time="'+(id-15)+'"]').addClass('current');
			id = id-15;
		}else if($('#events .event[data-time="'+(id+5)+'"]').length) {
			//console.log('condi-5');
			$('#events .event[data-time="'+(id+5)+'"]').addClass('current');
			id = id+5;
		}else if($('#events .event[data-time="'+(id+10)+'"]').length) {
			//console.log('condi-6');
			$('#events .event[data-time="'+(id+10)+'"]').addClass('current');
			id = id+10;
		}else if($('#events .event[data-time="'+(id+15)+'"]').length) {
			//console.log('condi-7');
			$('#events .event[data-time="'+(id+15)+'"]').addClass('current');
			id = id+15;
		}

		var $predecessors = $('#events .event[data-time="'+id+'"]:first').prevAll().get().reverse();
		$('#events').append($predecessors);

	}

	setTimeout('highlightRow("'+id+'");','1000');
	return true;
};

function loadTimers() {




  var list = [];

var events = {
	day: {
		name: "<i class=\"fa fa-sun-o\" aria-hidden=\"true\"></i> Jour",
    check: false,
    background: "#BFEFFF",
		phases: [
			{ start: "01:30" },
			{ start: "03:30" },
			{ start: "05:30" },
			{ start: "07:30" },
			{ start: "09:30" },
			{ start: "11:30" },
			{ start: "13:30" },
			{ start: "15:30" },
			{ start: "17:30" },
			{ start: "19:30" },
			{ start: "21:30" },
			{ start: "23:30" },
		]
	},
	night: {
		name: "<i class=\"fa fa-moon-o\" aria-hidden=\"true\"></i> Nuit",
    check: false,
    background: "#1998B6",
		phases: [
			{ start: "00:45" },
			{ start: "02:45" },
			{ start: "04:45" },
			{ start: "06:45" },
			{ start: "08:45" },
			{ start: "10:45" },
			{ start: "12:45" },
			{ start: "14:45" },
			{ start: "16:45" },
			{ start: "18:45" },
			{ start: "20:45" },
			{ start: "22:45" },
		]
	},
	current_events: {
		name: "Évènements actuels",
    check: false,
    background: "#718687",
		phases: [
			{ name: "Anomalie : Champs de Gandarran", start: "11:20", waypoint: "[&BOQAAAA=]", background: "#BE8746" },
			{ name: "Anomalie : Chutes de la canopéen", start: "13:20", waypoint: "[&BEwCAAA=]", background: "#BE8746" },
			{ name: "Moa et dévorreur", start: "11:35" },
			{ name: "Moa et dévorreur", start: "14:00" },
			{ name: "Moa et dévorreur", start: "14:15" },
			{ name: "Moa et dévorreur", start: "14:30" },
			{ name: "Arctodus et requin", start: "11:45" },
			{ name: "Arctodus et requin", start: "14:45" },
			{ name: "Arctodus et requin", start: "15:00" },
			{ name: "Vouivre", start: "13:00" },
			{ name: "Vouivre", start: "13:15" },
			{ name: "Vouivre", start: "13:35" },
			{ name: "Vouivre", start: "13:45" },
		]
	},
	verdant_brink: {
		name: "Orée d'émeraude",
    check: false,
    background: "#6DAC2F",
		phases: [
			{ name: "Canopée de nuit", start: "01:10" },
			{ name: "Canopée de nuit", start: "03:10" },
			{ name: "Canopée de nuit", start: "05:10" },
			{ name: "Canopée de nuit", start: "07:10" },
			{ name: "Canopée de nuit", start: "09:10" },
			{ name: "Canopée de nuit", start: "11:10" },
			{ name: "Canopée de nuit", start: "13:10" },
			{ name: "Canopée de nuit", start: "15:10" },
			{ name: "Canopée de nuit", start: "17:10" },
			{ name: "Canopée de nuit", start: "19:10" },
			{ name: "Canopée de nuit", start: "21:10" },
			{ name: "Canopée de nuit", start: "23:10" },
		]
	},
	auric_basin: {
		name: "Bassin aurique",
    check: false,
		phases: [
			{ name: "Pilliers", start: "00:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "02:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "04:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "06:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "08:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "10:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "12:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "14:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "16:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "18:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "20:30", background: "#FFE37F" },
			{ name: "Pilliers", start: "22:30", background: "#FFE37F" },
			{ name: "Défis", start: "01:45", background: "#FFD53D" },
			{ name: "Défis", start: "03:45", background: "#FFD53D" },
			{ name: "Défis", start: "05:45", background: "#FFD53D" },
			{ name: "Défis", start: "07:45", background: "#FFD53D" },
			{ name: "Défis", start: "09:45", background: "#FFD53D" },
			{ name: "Défis", start: "11:45", background: "#FFD53D" },
			{ name: "Défis", start: "13:45", background: "#FFD53D" },
			{ name: "Défis", start: "15:45", background: "#FFD53D" },
			{ name: "Défis", start: "17:45", background: "#FFD53D" },
			{ name: "Défis", start: "19:45", background: "#FFD53D" },
			{ name: "Défis", start: "21:45", background: "#FFD53D" },
			{ name: "Défis", start: "23:45", background: "#FFD53D" },
			{ name: "Octoliane", start: "02:00", background: "#EAB700" },
			{ name: "Octoliane", start: "04:00", background: "#EAB700" },
			{ name: "Octoliane", start: "06:00", background: "#EAB700" },
			{ name: "Octoliane", start: "08:00", background: "#EAB700" },
			{ name: "Octoliane", start: "10:00", background: "#EAB700" },
			{ name: "Octoliane", start: "12:00", background: "#EAB700" },
			{ name: "Octoliane", start: "14:00", background: "#EAB700" },
			{ name: "Octoliane", start: "16:00", background: "#EAB700" },
			{ name: "Octoliane", start: "18:00", background: "#EAB700" },
			{ name: "Octoliane", start: "20:00", background: "#EAB700" },
			{ name: "Octoliane", start: "22:00", background: "#EAB700" },
			{ name: "Octoliane", start: "00:00", background: "#EAB700" },
			{ name: "Pause", start: "00:20", background: "#FFF1C1" },
			{ name: "Pause", start: "02:20", background: "#FFF1C1" },
			{ name: "Pause", start: "04:20", background: "#FFF1C1" },
			{ name: "Pause", start: "06:20", background: "#FFF1C1" },
			{ name: "Pause", start: "08:20", background: "#FFF1C1" },
			{ name: "Pause", start: "10:20", background: "#FFF1C1" },
			{ name: "Pause", start: "12:20", background: "#FFF1C1" },
			{ name: "Pause", start: "14:20", background: "#FFF1C1" },
			{ name: "Pause", start: "16:20", background: "#FFF1C1" },
			{ name: "Pause", start: "18:20", background: "#FFF1C1" },
			{ name: "Pause", start: "20:20", background: "#FFF1C1" },
			{ name: "Pause", start: "22:20", background: "#FFF1C1" },
		]
	},
	tangled_depths: {
		name: "Prof. verd.",
    check: false,
    background: "",
		color: "red",
		phases: [
			{ name: "Préparation", start: "02:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "05:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "08:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "11:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "14:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "17:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "20:25", background: "#ffbdbd" },
			{ name: "Préparation", start: "23:25", background: "#ffbdbd" },
			{ name: "Régents Chaks", start: "02:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "05:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "08:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "11:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "14:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "17:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "20:30", background: "#ff9999" },
			{ name: "Régents Chaks", start: "23:30", background: "#ff9999" },
			{ name: "Aider les avants-postes", start: "02:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "05:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "08:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "11:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "14:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "17:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "20:50", background: "#FFD7D7" },
			{ name: "Aider les avants-postes", start: "23:50", background: "#FFD7D7" },
		]
	},
	dragons_stand: {
		name: "Repli du dragon",
    check: false,
    background: "#9f99cc",
		phases: [
			{ name: "Début", start: "00:30" },
			{ name: "Début", start: "02:30" },
			{ name: "Début", start: "04:30" },
			{ name: "Début", start: "06:30" },
			{ name: "Début", start: "08:30" },
			{ name: "Début", start: "10:30" },
			{ name: "Début", start: "12:30" },
			{ name: "Début", start: "14:30" },
			{ name: "Début", start: "16:30" },
			{ name: "Début", start: "18:30" },
			{ name: "Début", start: "20:30" },
			{ name: "Début", start: "22:30" },
		]
	},
	dry_top: {
		name: "Cimesèche",
    check: false,
    background: "",
		phases: [
			{ name: "Tempête", start: "00:40", background: "#DED98A" },
      { name: "Tempête", start: "01:40", background: "#DED98A" },
      { name: "Tempête", start: "02:40", background: "#DED98A" },
      { name: "Tempête", start: "03:40", background: "#DED98A" },
      { name: "Tempête", start: "04:40", background: "#DED98A" },
			{ name: "Tempête", start: "05:40", background: "#DED98A" },
			{ name: "Tempête", start: "06:40", background: "#DED98A" },
			{ name: "Tempête", start: "07:40", background: "#DED98A" },
			{ name: "Tempête", start: "08:40", background: "#DED98A" },
			{ name: "Tempête", start: "09:40", background: "#DED98A" },
			{ name: "Tempête", start: "10:40", background: "#DED98A" },
			{ name: "Tempête", start: "11:40", background: "#DED98A" },
			{ name: "Tempête", start: "12:40", background: "#DED98A" },
			{ name: "Tempête", start: "13:40", background: "#DED98A" },
			{ name: "Tempête", start: "14:40", background: "#DED98A" },
			{ name: "Tempête", start: "15:40", background: "#DED98A" },
			{ name: "Tempête", start: "16:40", background: "#DED98A" },
			{ name: "Tempête", start: "17:40", background: "#DED98A" },
			{ name: "Tempête", start: "18:40", background: "#DED98A" },
			{ name: "Tempête", start: "19:40", background: "#DED98A" },
			{ name: "Tempête", start: "20:40", background: "#DED98A" },
			{ name: "Tempête", start: "21:40", background: "#DED98A" },
			{ name: "Tempête", start: "22:40", background: "#DED98A" },
			{ name: "Tempête", start: "23:40", background: "#DED98A" },
			{ name: "Site de crash", start: "01:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "02:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "03:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "04:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "05:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "06:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "07:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "08:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "09:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "10:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "11:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "12:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "13:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "14:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "15:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "16:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "17:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "18:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "19:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "20:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "21:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "22:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "23:00", background: "#FCFADC" },
			{ name: "Site de crash", start: "00:00", background: "#FCFADC" },
		]
	},
	megadestroyer: {
		name: "Mégadestructeur",
    check: true,
    guide: "%lbm%/expeditions/world-boss/le-megadestructeur.html",
    background: "#B9D0D5",
		waypoint: "[&BM0CAAA=]",
    rewards: { rare: "1" },
		phases: [
			{ start: "01:30" },
			{ start: "04:30" },
			{ start: "07:30" },
			{ start: "10:30" },
			{ start: "13:30" },
			{ start: "16:30" },
			{ start: "19:30" },
			{ start: "22:30" },
		]
	},
	jungle_wurm: {
		name: "Grande guivre de la jungle",
    check: true,
    guide: "%lbm%/expeditions/world-boss/guivre-de-la-jungle.html",
    background: "#B9D0D5",
		waypoint: "[&BEEFAAA=]",
    rewards: { dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "00:15" },
			{ start: "02:15" },
			{ start: "04:15" },
			{ start: "06:15" },
			{ start: "08:15" },
			{ start: "10:15" },
			{ start: "12:15" },
			{ start: "14:15" },
			{ start: "16:15" },
			{ start: "20:15" },
			{ start: "22:15" },
		]
	},
	tequatl_the_sunless: {
		name: "Tequatl le Sans-soleil",
    check: true,
    guide: "%lbm%/expeditions/world-boss/tequatl-le-sans-soleil.html",
    background: "#EA568F",
		waypoint: "[&BNABAAA=]",
    rewards: { chest: "2", dragonite: "20", rare: "2" },
		phases: [
			{ start: "00:55" },
			{ start: "03:55" },
			{ start: "07:55" },
			{ start: "12:25" },
			{ start: "16:55" },
		]
	},
	claw_of_jormag: {
		name: "Griffe de Jormag",
    check: true,
    guide: "%lbm%/expeditions/world-boss/griffe-de-jormag.html",
    background: "#B9D0D5",
		waypoint: "[&BHoCAAA=]",
    rewards: { chest: "2", dragonite: "15-25", rare: "1" },
		phases: [
			{ start: "00:30" },
			{ start: "03:30" },
			{ start: "06:30" },
			{ start: "09:30" },
			{ start: "12:30" },
			{ start: "15:30" },
			{ start: "18:30" },
			{ start: "21:30" },
		]
	},
	shadow_behemoth: {
		name: "Béhémoth des ombres",
    check: true,
    guide: "%lbm%/expeditions/world-boss/behemoth-des-ombres.html",
    background: "#B9D0D5",
		waypoint: "[&BPwAAAA=]",
    rewards: { dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "00:45" },
			{ start: "02:45" },
			{ start: "04:45" },
			{ start: "06:45" },
			{ start: "08:45" },
			{ start: "10:45" },
			{ start: "12:45" },
			{ start: "14:45" },
			{ start: "16:45" },
			{ start: "18:45" },
			{ start: "20:45" },
			{ start: "22:45" },
		]
	},
	taidha_covington: {
		name: "Taidha Covington",
    check: true,
    guide: "%lbm%/expeditions/world-boss/taidha-covington.html",
    background: "#B9D0D5",
		waypoint: "[&BKgBAAA=]",
    rewards: { dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "01:00" },
			{ start: "04:00" },
			{ start: "07:00" },
			{ start: "10:00" },
			{ start: "13:00" },
			{ start: "16:00" },
			{ start: "19:00" },
			{ start: "22:00" },
		]
	},
	frozen_maw: {
		name: "Chamane de Svanir",
    check: true,
    background: "#B9D0D5",
		waypoint: "[&BKgBAAA=]",
    rewards: { dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "01:15" },
			{ start: "03:15" },
			{ start: "05:15" },
			{ start: "07:15" },
			{ start: "09:15" },
			{ start: "11:15" },
			{ start: "13:15" },
			{ start: "15:15" },
			{ start: "17:15" },
			{ start: "19:15" },
			{ start: "21:15" },
			{ start: "23:15" },
		]
	},
	evolved_jungle_wurm: {
		name: "Triple terreur",
    check: true,
    guide: "%lbm%/expeditions/world-boss/triple-terreur/",
		waypoint: "[&BKoBAAA=]",
    background: "#EA568F",
    rewards: { chest: "2", dragonite: "40", rare: "2" },
		phases: [
			{ start: "01:55" },
			{ start: "04:55" },
			{ start: "08:55" },
			{ start: "13:25" },
			{ start: "17:55" },
			{ start: "20:55" },
		]
	},
	fire_elemental: {
		name: "Élémentaire de feu",
    check: true,
    guide: "%lbm%/expeditions/world-boss/elementaire-de-feu-et-ogre-mecanique.html",
    background: "#B9D0D5",
		waypoint: "[&BEYAAAA=]",
    rewards: { chest: "2", dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "01:45" },
			{ start: "03:45" },
			{ start: "05:45" },
			{ start: "07:45" },
			{ start: "09:45" },
			{ start: "11:45" },
			{ start: "13:45" },
			{ start: "15:45" },
			{ start: "17:45" },
			{ start: "19:45" },
			{ start: "21:45" },
			{ start: "23:45" },
		]
	},
	the_shatterer: {
		name: "Le Destructeur",
    check: true,
    guide: "%lbm%/expeditions/world-boss/le-destructeur.html",
    background: "#B9D0D5",
		waypoint: "[&BE4DAAA=]",
    rewards: { dragonite: "15-25", rare: "1" },
		phases: [
			{ start: "02:00" },
			{ start: "05:00" },
			{ start: "08:00" },
			{ start: "11:00" },
			{ start: "14:00" },
			{ start: "17:00" },
			{ start: "20:00" },
			{ start: "23:00" },
		]
	},
	modniir_ulgoth: {
		name: "Ulgoth le Modniir",
    check: true,
    guide: "%lbm%/expeditions/world-boss/ulgoth-le-modniir.html",
    background: "#B9D0D5",
		waypoint: "[&BLEAAAA=]",
    rewards: { chest: "2", dragonite: "3-5", rare: "1" },
		phases: [
			{ start: "02:30" },
			{ start: "05:30" },
			{ start: "08:30" },
			{ start: "11:30" },
			{ start: "14:30" },
			{ start: "17:30" },
			{ start: "20:30" },
			{ start: "23:30" },
		]
	},
	golem_mark_ii: {
		name: "Golem Marque II",
    check: true,
    guide: "%lbm%/expeditions/world-boss/golem-marque-ii.html",
    background: "#B9D0D5",
		waypoint: "[&BNQCAAA=]",
    rewards: { chest: "2", dragonite: "15-25", rare: "1" },
		phases: [
			{ start: "00:00" },
			{ start: "03:00" },
			{ start: "06:00" },
			{ start: "09:00" },
			{ start: "12:00" },
			{ start: "15:00" },
			{ start: "18:00" },
			{ start: "21:00" },
		]
	},
	karka_queen: {
		name: "Reine karka",
    check: true,
    background: "#EA568F",
		waypoint: "[&BNcGAAA=]",
    guide: "%lbm%/expeditions/world-boss/reine-karka.html",
    rewards: { chest: "2", dragonite: "30", rare: "2" },
		phases: [
			{ start: "02:55" },
			{ start: "06:55" },
			{ start: "11:25" },
			{ start: "15:55" },
			{ start: "18:55" },
			{ start: "23:55" },
		]
	},
	/*demo: {
		name: "Démo",
    check: true,
		icon: "",
		background: "",
		color: "",
		rewards: [],
		waypoint: "",
		phases: [
			{ name: "", start: "01:30", color: "" },
			{ name: "", start: "04:30", color: "" },
		]
	},*/
};

var data = '';
var source = $("#timers-tpl").html();
var template = Handlebars.compile(source);
var html = template(data, {data: {intl: intlData}});
$('#page .container').html(html);



  $.each(events, function(key, event){

  	$.each(event.phases, function(i, phase) {

  		var name = (typeof phase.name !== 'undefined') ? '['+event.name+'] '+ phase.name : event.name,
  			icon = (typeof phase.icon !== 'undefined') ? phase.icon : event.icon,
  			background = (typeof phase.background !== 'undefined') ? phase.background : event.background,
  			color = (typeof phase.color !== 'undefined') ? phase.color : event.color,
  			rewards = event.rewards,
  			waypoint = (typeof phase.waypoint !== 'undefined') ? phase.waypoint : event.waypoint,
  			start = phase.start,
        check = (typeof event.check !== 'undefined') ? event.check : false,
        guide = (typeof event.guide !== 'undefined') ? '<a href="'+event.guide.replace('%lbm%', 'http://lebusmagique.fr/pages')+'" target="_blank"><i class="fa fa-info-circle" aria-hidden="true"></i> Guide</a>' : '',
        background = (typeof phase.background !== 'undefined') ? ' style="background-color:'+phase.background+';" ' : ((typeof event.background !== 'undefined') ? ' style="background-color:'+event.background+';" ' : '');

  		if(typeof name !== 'undefined' && typeof start !== 'undefined') {
  			list.push( { id: key, name: name, background: background, color: color, rewards: rewards, waypoint: waypoint, start: start, check: check, guide: guide, background: background } );
  		}

  	});

  });

  list = list.sort(function (a, b) {
      return a.start.localeCompare( b.start );
  });

  $.each(list, function(key, event) {
  	//console.log(event);
    // console.log(event.rewards);
    var rewards = '';
    if(typeof event.rewards !== 'undefined') {
      var rewards = [];
      $.each(event.rewards, function(reward, count) {
        rewards.push('<span class="reward '+reward+'">'+count+'</span>');
      });

      rewards = rewards.join('');
    }

  	$('#events').append('<div class="event '+event.id+'" data-id="'+event.id+'" data-time="'+event.start.replace(':', '')+'" id="event-'+key+'"'+event.background+'><span class="countdown"></span><span class="start">'+event.start+'</span><span class="name">'+ ((event.check) ? '<a href="#">' : '') + event.name + ((event.check) ? '</a>' : '') +'</span><span class="rewards">'+rewards+'</span><span class="guide">'+event.guide+'</span><span class="waypoint">'+((typeof event.waypoint !== 'undefined') ? '<button onclick="copyToClipboard(\''+event.waypoint+'\');">Point de passage</button>' : '') +'</span></div>');
  });












  highlightRow();
  for (var i = 0; i < list.length; i++){
		countdown(i);
	}
  // $.getJSON(lbm_api_url+'/?data=news', function(data) {

  // });
};

$(document).on('click','.event .name a', function(e){
    e.preventDefault();
    var id = $(this).parent().parent().data('id');
    if($('.event[data-id="'+id+'"]').hasClass('checked')) {
      $('.event[data-id="'+id+'"]').removeClass('checked');
    } else {
      $('.event[data-id="'+id+'"]').addClass('checked');
    }
});











































function loadConfig() {

  var data;

  var source = $("#config-tpl").html();
  var template = Handlebars.compile(source);
  var html = template(data, {data: {intl: intlData}});
  $('#page .container').html(html);

  var config_guilds = getConfig('guilds');
  var config_favorite_guild = getConfig('favorite_guild');
  var config_account_name = getConfig('account_name');
  var config_api_key = getConfig('api_key');
  var config_permissions = getConfig('permissions');
  var config_opacity = getConfig('opacity');

  if(config_account_name) {
    $('input#account_name').val(config_account_name);
  }

  if(config_api_key) {
    $('input#api_key').val(config_api_key);
  }

  if(config_guilds) {
    $("div.radios.guilds").html('<label class="radio"><input type="radio" id="favorite_guild" name="favorite_guild" value="" checked="checked" /> Aucune</label>');

    $.each(JSON.parse(config_guilds), function(i, j) {
      j = j.split("|");
      var selected = '';
      if(config_favorite_guild && config_favorite_guild == j[0]) {
        selected = ' checked="checked"';
      }
      $("div.radios.guilds").prepend('<label class="radio"><input type="radio" id="favorite_guild" name="favorite_guild" value="'+j[0]+'"'+selected+'/> ['+j[0]+'] '+j[1]+'</label>');
    });
  }

  if(config_permissions) {
    $.each(JSON.parse(config_permissions), function(i, j) {
      $("#permissions li."+j+" i.fa-li").removeClass('fa-square').addClass('fa-check-square');
    });
  }

  $( "input#api_key" ).focus(function() {
    if( $(this).hasClass('error') ) {
      $(this).removeClass('error');
    }
  });

  if(config_opacity) {
    $('input[value="'+config_opacity+'"]').attr("checked", "checked");
  }

};

function achievements_done() {
  var done_today = getConfig('achievements_done_today');
  var done_list = getConfig('achievements_done_list');
  var date = new Date();
  var today = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

  if(done_today && done_today != today) {
    setConfig('achievements_done_today', today);
    deleteConfig('achievements_done_list');
  } else if(done_today && done_list) {
    var done_list = done_list.split(',');
    $.each(done_list, function(i, j) {
      // console.log('.achievement.achievement-'+j);
      $('.achievement.achievement-'+j).addClass('checked');
    });
  } else {
    setConfig('achievements_done_today', today);
    deleteConfig('achievements_done_list');
  }
};

(function($){
  $(window).on("load",function(){
    //add_class_has_scrollbar();
    setOpacity();

    var current_menu = getConfig('menu');
    var current_submenu = getConfig('submenu');

    if(current_menu) {
      $('#menu > li.active').removeClass('active');
      $('#menu > li > a.'+current_menu).parent().addClass('active');
    } else if (!current_submenu) {
      loadPage('guild-motd');
    }

    if(current_submenu) {
      $('#menu ul li.active').removeClass('active');
      $('#menu ul li a.'+current_submenu).parent().addClass('active');
      loadPage(current_submenu);
    } else {
      loadPage(current_menu);
    }
  });

  $( window ).resize(function() {
    add_class_has_scrollbar();
  });
})(jQuery);

$(document).on("click",'#menu a[data-page]', function(){
  var page = $(this).data('page');
  var hasParent = $(this).parent().parent().prev('a').length;

  deleteConfig('menu');
  deleteConfig('submenu');

  if(hasParent) {
    setConfig('menu', $(this).parent().parent().prev('a').attr('class'));
    setConfig('submenu', page);
  } else {
    setConfig('menu', page);
  }

  setConfig('page', page);
  loadPage(page);
});

$(document).on("click",'#menu a', function(e){
  e.preventDefault();

  var hasParent = $(this).parent().parent().prev('a').length;
  if(hasParent) {
    $('#menu ul li.active').removeClass('active');
    $(this).parent().addClass('active');
  } else {
    $('#menu li.active').removeClass('active');
    $(this).parent().addClass('active');
  }
});

$(document).on("click",'dl.achievement dt', function(){
    var dl = $(this).parent();
    var id = dl.data('id');
    var done_list = getConfig('achievements_done_list');

    if(dl.hasClass('checked')) {
      done_list = done_list.split(',').map(Number);
      done_list.splice(done_list.indexOf(id), 1);
      if(done_list.length > 0) {
        setConfig('achievements_done_list', done_list.join());
      } else {
        deleteConfig('achievements_done_list');
      }
    } else {
      if(!done_list) {
        setConfig('achievements_done_list', id);
      } else {
        setConfig('achievements_done_list', done_list+','+id);
      }
    }

    dl.toggleClass('checked');
});

$(document).on("click",'input#api_key', function(){
    $(this).focus().select();
});

$(document).on("submit", "form#config", function(){
  var $api_key = $('input#api_key'),
      $favorite_guild = $('input#favorite_guild:checked'),
      $opacity = $('input#opacity:checked'),
      $button = $('button[type="submit"]'),
      $reload = $('button#reload');

  $button.find('i').remove();
  $button.prepend('<i class="fa fa-spinner fa-pulse"></i> ');

  setConfig('opacity', $opacity.val());

  if($api_key.val() == '') {
    resetConfig();
    location.reload();
    return false;
  }

  $.getJSON('https://api.guildwars2.com/v2/tokeninfo?access_token='+$api_key.val(), function(data) {
    setConfig('api_key', $api_key.val());
    setConfig('permissions', JSON.stringify(data.permissions));

    $.getJSON('https://api.guildwars2.com/v2/account?access_token='+$api_key.val(), function(data) {
      setConfig('account_access', data.access);
      setConfig('account_name', data.name);
      setConfig('account_id', data.id);

      var guilds = [];

      $.each(data.guilds, function(i, j) {
        $.getJSON('https://api.guildwars2.com/v2/guild/'+ j, function(data) {
          guilds.push(data.tag+'|'+data.name);
          setConfig('guilds', guilds);
        });
		  });
    });

    $.getJSON('https://api.guildwars2.com/v2/characters?access_token='+$api_key.val(), function(data) {
      var high_level = 0;
      $.each(data, function(i, j) {
        $.getJSON('https://api.guildwars2.com/v2/characters/'+ j.replace(' ', '%20') +'?lang=fr&access_token='+$api_key.val(), function(data) {
          if(high_level < data.level) {
            high_level = data.level;
            setConfig('high_level', high_level);
          }
        });
      });
    });

    if($favorite_guild.val() !== '') {
      setConfig('favorite_guild', $favorite_guild.val());
    }

  }).fail(function(error) {
    if(error.status == 403) {
      resetConfig();
      location.reload();
    }
  });

  $button.find('i').removeClass('fa-spinner').removeClass('fa-pulse').addClass('fa-check-circle');
  $reload.show();

  return false;
});
