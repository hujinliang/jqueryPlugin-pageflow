/**
 * Created by lenovo on 2016/5/14.
 */
;
(function($,window,document){

    var defaults = {

        selectors:{
            section:'.section',
            page:'.pages',
            active:'.active'
        },
        index:0,
        ease:'swing',
        duration:500,
        loop:false,
        pagination:true,
        keyboard:true,
        direction:'vertical',
        callback:''
    };

    function PageFlow(ele,options){
        this.settings = $.extend({},defaults,options);
        this.element = ele;
        this.init();
    }

    PageFlow.prototype = {
        init:function(){
            var me = this;
            this.canScroll = true;
            this.selector = this.settings.selectors;
            this.section = $(this.element).find(this.selector.section);
            this.direction = this.settings.direction;

            this.pageCount = this.section.length;
            this.index = (this.settings.index>=0&&this.settings.index<this.pageCount)?this.settings.index:0;

            if(!(this.direction === 'vertical')){
                this._initLayout();
            }

            if(this.settings.pagination){
                this._initPaging();
            }

            this._initEvent();
        },
        switchLength:function(){
            return this.direction==='vertical'?this.element.height():this.element.width();
        },
        _initLayout:function(){
            var width = (this.pageCount*100)+'%';
            var cellWidth = (100/this.pageCount).toFixed(2)+'%';
            $(this.element).width(width);
            $(this.section).width(cellWidth).css('float','left');
        },
        _initPaging:function(){
            var me = this,
                pagesClass = this.selector.page.slice(1);
            this.activeClass = this.selector.active.slice(1);
            var activeClass = this.selector.active.slice(1);
            var pageHtml = $('<ul>',{
                class:pagesClass
            }).css({
                position:'fixed',
                top:$(window).height()/2+'px',
                right:'10px',
                'listStyle':'none'
            });
            for(var i = 0;i < this.pageCount; i ++){
                var li = $('<li>').css({
                    border: 'none',
                    width: '8px',
                    height: '8px',
                    'border-radius': '50%',
                    background: '#fff',
                    margin: '0 0 10px 5px'

                });
                pageHtml.append(li);
            }

            $(this.element).append(pageHtml);
            var pages = $(this.element).find(this.selector.page);
            this.pageItem = pages.find('li');
            this.pageItem.eq(this.index).addClass(activeClass).css({
                width: '14px',
                height: '14px',
                border: '2px solid #FFFE00',
                background: 'none',
                'margin-left': '0',
            });

            if(this.direction === 'vertical'){
                pages.addClass('vertical');
            }else{
                pages.addClass('horizontal');
            }
        },
        _initEvent:function(){
            var me = this;
            $(me.element).on('click',me.selector.page+' li',function(){
                me.index = $(this).index();
                me._scrollPage();
            });

            $(me.element).on('mousewheel DOMMouseScroll',function(e){
                if(me.canScroll){
                    var delta = e.originalEvent.wheelDelta||-e.originalEvent.detail;

                    if(delta>0&&((me.index>0&&!me.settings.loop)||me.settings.loop)){
                        me.prev();
                    }else if(delta<0&&(me.index<(me.pageCount-1)&&!me.settings.loop)||me.settings.loop){
                        me.next();
                    }
                }
            });

            if(me.settings.keyboard){
                $(window).on('keydown',function(e){
                    var keyCode = e.keyCode;
                    if(keyCode == 37||keyCode == 38){
                        me.prev();
                    }else if(keyCode == 39 || keyCode == 40){
                        me.next();
                    }
                })
            }
            $(window).resize(function(){
                $(me.element).find(me.selector.page).remove();
                me._initPaging();
            })

        },
        prev:function(){
            var me = this;
            if(me.index>0){
                me.index --;
            }else if(me.settings.loop){
                me.index = me.pageCount -1;
            }
            me._scrollPage();
        },
        next:function(){
            var me = this;
            if(me.index<me.pageCount-1){
                me.index ++;
            }else if(me.settings.loop){
                me.index =0;
            }
            me._scrollPage();
        },
        _scrollPage:function(){
            var me = this;
            me.canScroll = false;
            var dest = this.section.eq(this.index).position();
            var animateCss = me.direction==='vertical'?{top:-dest.top}:{left:-dest.left};
            $(this.element).stop().animate(animateCss,this.settings.duration,this.settings.ease,function(){
                me.canScroll = true;
            });

            if(me.settings.pagination){
                me.pageItem.eq(me.index).addClass(me.activeClass).css({
                    width: '14px',
                    height: '14px',
                    border: '2px solid #FFFE00',
                    background: 'none',
                    'margin-left': '0',
                }).siblings('li').removeClass(me.activeClass).css({
                    border: 'none',
                    width: '8px',
                    height: '8px',
                    'border-radius': '50%',
                    background: '#fff',
                    margin: '0 0 10px 5px'
                });
            }
        }
    };


    $.fn.pageflow = function(options){
        return this.each(function(){
            var me = $(this),
                instance = me.data('pageflow');
            if(!instance){
                intance = new PageFlow(this,options);
                me.data('pageflow',instance);
            }
        })
    }

    $('[data-pageflow]').pageflow();

})(jQuery,window,document);