/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.grid.DataDrop
 * @extends Ext.Component
 * <p>A plugin that allows data to be dragged into a grid from spreadsheet applications (tabular data).</p>
 */
Ext.ux.grid.DataDrop = Ext.extend(Ext.Component, {
    // private
    init: function(cmp){
        this.cmp = cmp;
        this.changeValueTask = {
            run: function(){
                this.dataDropped({}, this.textEl);
            },
            interval: 250,
            scope: this
        };
        this.cmp.on('render', this.onRender, this, {
            delay: 100
        });
    },
    // private
    onRender: function(){
        this.gridBody = Ext.get(this.cmp.body.select('.x-grid3-body').elements[0]);
        if (this.gridBody) {
            var el = Ext.DomHelper.insertAfter(this.gridBody, {
                tag: 'textarea',
                id: Ext.id(),
                value: '',
                style: {
                    'font-size': '1px',
                    color: '#fff',
                    border: 'none',
                    height: '100px'
                }
            });
            this.textEl = Ext.get(el);
            this.gridScroller = Ext.get(this.cmp.body.query('.x-grid3-scroller')[0]);
            this.resizeDropArea();
            this.textEl.on('change', this.dataDropped, this);
            this.textEl.on('focus', this.blur);
            this.cmp.on('resize', this.resizeDropArea, this);
            Ext.TaskMgr.start(this.changeValueTask);
        }
    },
    // private
    resizeDropArea: function(){
        var wh = this.gridScroller.getSize(), scrollOffset = this.cmp.getView().scrollOffset;
        wh.width = wh.width - scrollOffset;
        wh.height = wh.height - this.gridBody.getHeight() - scrollOffset;
        if (wh.height < 100) {
            wh.height = 100;
        }
        this.textEl.setSize(wh);
    },
    // private
    dataDropped: function(e, el){
        var nv = el.getValue();
        el.blur();
        if (nv !== '') {
            var store = this.cmp.getStore(), rec = store.reader.recordType;
            el.dom.value = '';
            this.nv = nv;
            Ext.TaskMgr.stop(this.changeValueTask);
            this.rows = this.nv.split(/\r\n|\r|\n/);
            for (i = 0; i < this.rows.length; i++) {
                var vals = this.rows[i].split(/\s*\t\s*/), data = {}, f = 0;
				if (vals.join('').replace(' ', '') != '') {
					for (k = 0; k < vals.length; k++) {
						if (store.reader.meta.fields[f] == store.reader.meta.idProperty) {
							f++;
						}
						data[store.reader.meta.fields[f]] = vals[k];
						f++;
					}
					store.add(new rec(data));
				}
            }
            Ext.TaskMgr.start(this.changeValueTask);
        }
    }
});
