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
  } else if(page == 'pact-agents') {
    loadPactAgents(); var refresh = setInterval(function(){ loadPage(page); }, d3);
  } else if(page == 'config') {
    loadConfig(); var refresh = 0;
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
