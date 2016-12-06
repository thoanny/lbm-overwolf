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
}

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

function openConfigWindow() {
  overwolf.windows.obtainDeclaredWindow("ConfigWindow", function(result){
    if (result.status == "success"){
      overwolf.windows.restore(result.window.id, function(result){
          console.log(result);
      });
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

function loadPage(page) {

  $('#page .container').html('<i class="fa fa-spinner fa-pulse fa-fw"></i> Chargement en cours...');

  if(page == 'guild-motd') {
    loadMotd();
  } else if(page == 'guild-stash') {
    loadStash();
  } else if(page == 'last-news-pages') {
    loadNewsPages();
  } else if(page == 'next-events') {
    loadEvents();
  } else if(page == 'daily-pve') {
    loadAchievementsDaily('pve');
  } else if(page == 'daily-pvp') {
    loadAchievementsDaily('pvp');
  } else if(page == 'daily-wvw') {
    loadAchievementsDaily('wvw');
  } else if(page == 'daily-special') {
    loadAchievementsDaily('special');
  } else if(page == 'daily-fen') {
    loadAchievementsCategory(142, 'fen');
  } else if(page == 'daily-bay') {
    loadAchievementsCategory(145, 'bay');
  } else if(page == 'daily-frontier') {
    loadAchievementsCategory(149, 'frontier');
  } else if(page == 'daily-fractals') {
    loadAchievementsCategory(88, 'fractals');
  } else if(page == 'pact-agent') {

  }

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

function loadNewsPages() {
  $.getJSON(lbm_api_url+'/?data=newspages', function(data) {
    var source = $("#newspages-tpl").html();
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
        achievements = [];

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
      });

      $.each(data, function(i, j) {
        $.each(j, function(k, l) {
          var id = data[i][k]['id'];
          data[i][k]['name'] = names[id];
          data[i][k]['icon'] = icons[id];
          data[i][k]['requirement'] = requirements[id];
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

      var source   = $("#daily-tpl").html();
      var template = Handlebars.compile(source);
      var html    = template(achievements);
      $('#page .container').html(html);

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
          data[m] = { "id":  n.id, "name": n.name, "icon": icon, "requirement": n.requirement };
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

    });

  });

};

(function($){
  $(window).on("load",function(){
    $('#menu').dropdown();

    if(getConfig('page')) {
      var page = getConfig('page');
      loadPage(page);
      $('div.menu > span').html( $('div.menu ul li[data-value="'+page+'"]').html() );
      $('div.menu input[name="menu"]').val( page );
    } else {
      loadPage('guild-motd');
    }
  });
})(jQuery);

$(document).on("click",'.menu ul span', function(){
    var page = $(this).attr('class');
    loadPage(page);
    setConfig('page', page);
});
$(document).on("click",'dl.achievement dt', function(){
    var dl = $(this).parent();
    dl.toggleClass('checked');
});
