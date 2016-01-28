# MOVED TO GITHUB #

https://github.com/VinylFox/ExtJS.ux.DataDrop

This code repository will no longer receive updates, please visit Github for most recent version.

# Ext.ux.grid.DataDrop #

This plugin is to be used on an ExtJS 3.x grid, giving that grid the ability to accept data dragged from spreadsheet programs such as Excel and OpenOffice Calc right into the grid to create rows of data. See [my blog post about it](http://www.vinylfox.com/datadrop-drag-grid-data-from-spreadsheet/), and the [event forwarding post](http://www.vinylfox.com/forwarding-mouse-events-through-layers/) for more details.

## Example Usage (Current Version [r5](https://code.google.com/p/ext-ux-datadrop/source/detail?r=5) and up - Singleton) ##

```
{
	xtype: 'grid',
	...,
	plugins: [Ext.ux.grid.DataDrop],
	...
}
```

## Example Usage (Previous Version [r4](https://code.google.com/p/ext-ux-datadrop/source/detail?r=4) - Extends Component) ##

```
{
	xtype: 'grid',
	...,
	plugins: [new Ext.ux.grid.DataDrop()],
	...
}
```