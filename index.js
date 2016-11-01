module.exports = function(map, option) {
	var subMenus = { _meta: new nw.Menu(option), _items: {} };
	var It = function(LMap, parentMenu) {
		for (var key in LMap) {
			if (key == '_meta') continue;
			var data = LMap[key];
			if (data == '_') data = { _meta: { type: 'separator' } };
			var item = new nw.MenuItem(data._meta);
			var subMenu;
			if (Object.keys(data).length > 1) {
				subMenu = { _meta: new nw.Menu(), _items: {} };
				It(data, subMenu);
				parentMenu[key] = subMenu;
			}
			if (subMenu) item.submenu = subMenu._meta;
			parentMenu._items[key] = item;
			parentMenu._meta.append(item);
		}
	}
	It(map, subMenus);
	return {
		subMenus: subMenus,
		bar: function() {
			return this.subMenus._meta;
		},
		getSubMenu: function(path) {
			try {
				return eval('this.subMenus.'+ path +'._meta');
			}
			catch (e) { console.log(e); }
		},
		getItem: function(path) {
			var lastDot = path.lastIndexOf('.') + 1;
			var name = path.substring(lastDot);
			path = path.substring(0, lastDot);
			try {
				return eval('this.subMenus.'+ path +'_items.'+ name);
			}
			catch (e) { console.log(e); }
		}
	};
};