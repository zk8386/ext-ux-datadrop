Ext.ns('Ext.ux.grid');
/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @contributor Nigel (Animal) White
 * @class Ext.ux.grid.DataDrop
 * @singleton
 * <p>A plugin that allows data to be dragged into a grid from spreadsheet applications (tabular data).</p>
 * <p>Sample Usage</p>
 * <pre><code>
{
	xtype: 'grid',
	...,
	plugins: [Ext.ux.grid.DataDrop],
	...
}
 * </code></pre>
 */
Ext.ux.grid.DataDrop = (function() {

//  After the GridView has been rendered, insert a static textarea after it.
//  Ensure the scroller is sized to accomodate it.
    function onViewRender(){
        var v = this.view;
        if (v.mainBody) {
            this.textEl = Ext.DomHelper.insertAfter(v.mainBody, {
                tag: 'textarea',
                id: Ext.id(),
                value: '',
                style: {
					'font-size': '1px',
                    border: '0px none',
                    overflow: 'hidden',
                    color: '#fff',
                    'background-color': 'transparent',
                    margin: 0,
                    height: '100px',
					cursor: 'default'
                }
            }, true);
            this.textEl.setVisibilityMode(Ext.Element.DISPLAY);
            this.textEl.on({
				mouseover: function(){
					Ext.TaskMgr.start(this.changeValueTask);
				},
				mouseout: function(){
					Ext.TaskMgr.stop(this.changeValueTask);
				},
                scope: this
            });
			resizeDropArea.call(this);
        }
    }

//  on GridPanel resize, keep scroller height correct to accomodate textarea.
    function resizeDropArea(){
        if (this.textEl) {
			var nh = (this.view.scroller.getHeight() - this.view.mainBody.getHeight() - 6);
			var nw = (this.view.mainBody.getWidth());
			if (nh < 100) { nh = 100; }
            this.textEl.setSize({
				height: nh,
				width: nw
			});
        }
    }

//  on change of data in textarea, create a Record from the tab-delimited contents.
    function dataDropped(e, el){
        var nv = el.value;
        el.blur();
        if (nv !== '') {
            var store = this.getStore(), Record = store.recordType;
            el.value = '';
            var rows = nv.split(/\r\n|\r|\n/),
                cols = this.getColumnModel().getColumnsBy(function(c){
                    return !c.hidden;
                }),
                fields = Record.prototype.fields;
            if (cols.length && rows.length) {
                for (var i = 0; i < rows.length; i++) {
                    var vals = rows[i].split(/\s*\t\s*/), data = {};
                    if (vals.join('').replace(' ', '') !== '') {
                        for (var k = 0; k < vals.length; k++) {
                            var fldName = cols[k].dataIndex;
                            var fld = fields.item(fldName);
                            data[fldName] = fld ? fld.convert(vals[k]) : vals[k];
                        }
                        var newRec = new Record(data);
                        store.add(newRec);
                        var idx = store.indexOf(newRec);
                        this.view.focusRow(idx);
                        Ext.get(this.view.getRow(idx)).highlight();
                    }
                }
				resizeDropArea.call(this);
            }
        }
    }

    return {
        init: function(cmp){
            Ext.apply(cmp, {
                changeValueTask: {
                    run: function(){
                        dataDropped.call(this, null, this.textEl.dom);
                    },
                    interval: 100,
                    scope: cmp
                },
                onResize: cmp.onResize.createSequence(resizeDropArea)
            });
            cmp.getView().afterRender = cmp.getView().afterRender.createSequence(onViewRender, cmp);
        }
    };
})();