// global variable
var container_height = $('#sspa-wrapper').height();

// router
var router = Backbone.Router.extend({
	routes: {
		'': 'firstLoad',
		'index': 'gotoIndex',
		'material': 'gotoMaterial',
		'design': 'gotoDesign',
		'products': 'gotoProducts',
		'tech': 'gotoTech',
		'material/pane:index': 'gotoPane_m',
		'design/pane:index': 'gotoPane_d',
		'products/pane:index': 'gotoPane_p',
		'tech/pane:index': 'gotoPane_t'
	},
	firstLoad: function() {		
		$('.sspa-inner').hide();
		Index.render();
	},
	gotoIndex: function() {
		$('.sspa-inner').hide();
		Index.render();
	},
	gotoMaterial: function() {
		Index.hide();
		$('.sspa-inner').hide();
		Material_pane.render();
	},
	gotoDesign: function() {
		Index.hide();
		$('.sspa-inner').hide();
		Design_pane.render();
	},
	gotoProducts: function() {
		Index.hide();
		$('.sspa-inner').hide();
		Products_pane.render();
	},
	gotoTech: function() {
		Index.hide();
		$('.sspa-inner').hide();
		Tech_pane.render();
	},
	gotoPane_m: function(index) {
		Index.hide();
		Material_pane.render();
		Material_pane.showPane(index - 1)
	},
	gotoPane_d: function(index) {
		Index.hide();
		Design_pane.render();
		Design_pane.showPane(index - 1)
	},
	gotoPane_p: function(index) {
		Index.hide();
		Products_pane.render();
		Products_pane.showPane(index - 1)
	},
	gotoPane_t: function(index) {
		Index.hide();
		Tech_pane.render();
		Tech_pane.showPane(index - 1)
	}
});

var index = Backbone.View.extend({
	el: '#index',
	hide: function() {
		this.$el.hide().removeClass('active')
	},
	render: function() {
		this.$el.show().animate({
				opacity: 1
			}, 300, 'ease',
			function() {
				$(this).addClass('active')
			});
	}
})

// main-view
var sspa = Backbone.View.extend({
	initialize: function() {
		this.$el.height(container_height * this.child_count())
			.children('section').height(container_height);
	},
	child_count: function() {
		return this.el.childElementCount
	},
	current_pane: 0,
	events: {
		'click a.arrow': 'gotoNext',
		'pan': 'handlePan',
		'panend': 'triggerPanend'
	},
	render: function() {
		this.$el.show().animate({
				opacity: 1
			}, 300, 'ease',
			function() {
				$(this).children('section').eq(0).addClass('active')
			});
		this.showPane(0)
		this.trigger('rendered')
	},
	openPop: function(event) {
		event.preventDefault();
		this.undelegateEvents();
		this.trigger('openPop');
	},
	gotoNext: function() {
		event.preventDefault();
		this.showPane(this.current_pane + 1)
	},
	handlePan: function(event) {
		event.preventDefault();
		setCss(this.el, {
			transform: 'translate3d(0,-' + (container_height * this.current_pane - event.displacementY) + 'px,0)',
			transition: 'none'
		})
	},
	triggerPanend: function() {
		event.preventDefault();
		var pageindex;
		if (Math.abs(event.displacementY) > 140) {
			event.displacementY < 0 ? pageindex = this.current_pane + 1 : pageindex = this.current_pane - 1;
		} else {
			pageindex = this.current_pane
		}
		this.showPane(pageindex)
	},
	movePane: function() {
		setCss(this.el, {
			transform: 'translate3d(0,-' + container_height * this.current_pane + 'px,0)',
			transition: '.3s ease'
		})
	},
	showPane: function(index) {
		var index = Math.max(0, Math.min(index, this.child_count() - 1));
		this.current_pane = index;
		SspaRouter.navigate(this.el.id + "/pane" + (this.current_pane + 1));
		this.movePane();
		this.$el.find('section').eq(this.current_pane).addClass('active')
			.siblings('section').removeClass('active')
	}
})

// popwin-view
var popwin = Backbone.View.extend({
	el: '#popwin',
	initialize: function() {
		setCss(this.el, {
			transform: 'translate3D(0,1000px,0) scale3D(0.4,0.4,0.4)'
		})
	},
	render: function() {
		this.$el.animate({
			translate3d: '0,0,0',
			scale3d: '1,1,1'
		}, 500, 'ease')
	},
	events: {
		'click a.closebtn': 'closePop'
	},
	closePop: function() {
		event.preventDefault();
		this.trigger('closePop');
		this.$el.animate({
			translate3d: '0,1000px,0',
			scale3d: '0.4,0.4,0.4'
		}, 500, 'ease')
		return false;
	}
})

// start sspa
var Index = new index();
var Material_pane = new sspa({
	el: '#material'
});
var Design_pane = new sspa({
	el: '#design'
});
var Products_pane = new sspa({
	el: '#products'
});
var Tech_pane = new sspa({
	el: '#tech'
});
var Popwin = new popwin();
var SspaRouter = new router();
Backbone.history.start();

var scene = document.getElementById('scene');
var parallax = new Parallax(scene);
// view-view connection
Popwin.listenTo(Material_pane, 'openPop', function() {
	this.render()
})
Material_pane.listenTo(Popwin, 'closePop', function() {
	this.delegateEvents(this.events)
})