# nw-menu

Rapidly create menus in NW.js with dot-notated indexing for every single item.

## Install

```
$ npm install --save nw-menu
```

Core dependency is NW.js.

## API

### Constructor

```
const nwMenu = require('nw-menu');
var appMenu = new nwMenu(map, option);
```

`map` is the object containing tree of menu items. Self-references are set into `_meta`. They must be formatted as well as [`nw.MenuItem`](http://docs.nwjs.io/en/latest/References/MenuItem/#new-menuitemoption). Other properties are children items and their keys can be used in dot-notation syntax to identify needed `MenuItem`s.

Example map object:
```
{
	test: {
		_meta: { label: 'Your caption here...' },
	},
	copy: {
		_meta: { label: 'Copy', key: 'C', modifiers: 'ctrl' },
	},
	paste: {
		_meta: { label: 'Paste', key: 'V', modifiers: 'ctrl' },
	},
	menu: {
		_meta: { label: '1st menu' },
		menu: {
			_meta: { label: '2nd menu' },
			menu: {
				_meta: { label: '3rd menu', click: function() { alert('Clicked on 3rd item'); } }
			}
		}
	}
}
```

`option` is the object that is used in initial nw.Menu call to specify the type of menu. If you want to use menu as `menubar`, type this:

```
{ type: 'menubar' }
```

If you ignore `option` you'll get `contextmenu` anyway.

## Usage example

Creating `menubar`:
```
const nwMenu = require('nw-menu');
var appMenu = new nwMenu({
	file: {
		_meta: { label: 'File' },
		new_: { _meta: { label: 'New', key: 'N', modifiers: 'ctrl' } },
		open: { _meta: { label: 'Open', key: 'O', modifiers: 'ctrl' } },
		save: { _meta: { label: 'Save', key: 'S', modifiers: 'ctrl' } },
		saveAs: { _meta: { label: 'Save as...', key: 'S', modifiers: 'ctrl+shift' } },
		_print: '_',
		print: { _meta: { label: 'Print', key: 'P', modifiers: 'ctrl' } },
		_quit: '_',
		quit: { _meta: { label: 'Quit', click: function() { require('process').exit(0); } } },
	},
	window: {
		_meta: { label: 'Window' },
		console: { _meta: { type: 'checkbox', label: 'Console' } },
		properties: { _meta: { type: 'checkbox', label: 'Properties' } }
	}
}, { type: 'menubar' });
```

Bind `menubar` to NW.js window:
```
nw.Window.get().menu = appMenu.bar();
```

String with underscore ('_') as value is used for separator:
```
	_section1: '_'
	// It's same as:
	_section1: { _meta: { type: 'separator' } }
```

Time for something hot. Let's disable `save` button:
```
	appMenu.getItem('file.save').enabled = false;
```

`nwMenu.getItem` returns [`MenuItem`](http://docs.nwjs.io/en/latest/References/MenuItem) object associated with specified item.

Now add click callback for some of `checkbox` items to check switching states:
```
	...
	console: { _meta: { type: 'checkbox', label: 'Console', click: function() {
		if (appMenu.getItem('window.console').checked) alert('Switching console on...');
		else alert('Closing console...');
	} } },
	...
```

### Needs testing

You can pop up any of context subMenus created by `nwMenu`:
```
appMenu.getSubMenu('window').popup(0, 0);
```
(However, `popup` method has issues on my side: I don't know why it's crashing app.)