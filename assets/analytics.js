// 2oVus Website Analytics - Mixpanel Integration
// Token: Website

(function() {
    'use strict';

    // Mixpanel SDK snippet
    (function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

    // Initialize Mixpanel with EU endpoint for GDPR compliance
    mixpanel.init('d43537cff970f4350eba3658bccbcc28', {
        api_host: 'https://api-eu.mixpanel.com',
        track_pageview: true,
        persistence: 'localStorage'
    });

    // Helper: Get page name from URL
    function getPageName() {
        var path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        return path.replace(/^\//, '').replace(/\.html$/, '');
    }

    // Helper: Track click event
    function trackClick(eventName, properties) {
        var baseProps = {
            page: getPageName(),
            url: window.location.href,
            referrer: document.referrer || 'direct'
        };
        mixpanel.track(eventName, Object.assign({}, baseProps, properties || {}));
    }

    // Track page view on load
    document.addEventListener('DOMContentLoaded', function() {
        trackClick('page_viewed', {
            title: document.title
        });

        // Track CTA button clicks
        document.querySelectorAll('.cta-button').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                trackClick('cta_clicked', {
                    cta_text: this.textContent.trim(),
                    cta_location: this.closest('section')?.className || 'unknown'
                });
            });
        });

        // Track store link clicks (Google Play / App Store)
        document.querySelectorAll('.store-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var isAppStore = this.innerHTML.includes('App Store') || this.title?.includes('App Store');
                var store = isAppStore ? 'app_store' : 'google_play';
                var location = 'unknown';

                if (this.closest('header')) {
                    location = 'header';
                } else if (this.closest('.cta-section')) {
                    location = 'cta_section';
                } else if (this.closest('.cta-stores')) {
                    location = 'cta_section';
                }

                trackClick('store_link_clicked', {
                    store: store,
                    link_location: location
                });
            });
        });

        // Track footer navigation links
        document.querySelectorAll('.footer-column a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                trackClick('footer_link_clicked', {
                    link_text: this.textContent.trim(),
                    link_href: this.getAttribute('href')
                });
            });
        });

        // Track logo click (home navigation)
        var logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.addEventListener('click', function(e) {
                if (getPageName() !== 'home') {
                    trackClick('logo_clicked', {
                        from_page: getPageName()
                    });
                }
            });
        }

        // Track contact form submission (if on contact page)
        var contactForm = document.querySelector('form');
        if (contactForm && getPageName() === 'contact') {
            contactForm.addEventListener('submit', function(e) {
                trackClick('contact_form_submitted', {
                    form_type: 'contact'
                });
            });
        }

        // Track FAQ accordion clicks (if exists)
        document.querySelectorAll('.faq-question, .accordion-header').forEach(function(faqItem) {
            faqItem.addEventListener('click', function(e) {
                trackClick('faq_item_clicked', {
                    question: this.textContent.trim().substring(0, 100)
                });
            });
        });
    });

    // Expose for manual tracking if needed
    window.tovusAnalytics = {
        track: trackClick
    };
})();
