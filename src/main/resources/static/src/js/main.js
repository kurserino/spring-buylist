
 (function($) {
    $(function() {
      // Swiper
      let swiperParams = {
        freeMode: true,
        spaceBetween: 15,
        slidesPerView: 'auto',
        slidesOffsetAfter: 74,

        navigation: {
     nextEl: '.nextButton',
     prevEl: '.prevButton',
   },
      };

       var swiper = new Swiper( $(window).width() < 771 ?  '.swiper-container' : '.swiper-container.desktop' , swiperParams);

    // $(window).on('resize', swiperWindowResizeHandler)
    //
    //  // Init swiper if smaller screen
    //  $(window).width() < 771 ? enableSwiper() : !1;

     // Copy to clipboard
     var clipboard = new ClipboardJS('.btn');
        clipboard.on('success', function(e) {
            showToastNotification('Copied!');
        });
        clipboard.on('error', function(e) {
            console.log(e);
        });

        // Toast notifications
      let showToastNotification = message => {
          // Set toast message
          let toast = $(`
            <div class="toastNotification">
              ${message}
            </div>`.trim()
          );

          // Append toast
          $(toast)
              .appendTo('body')
              .animate({ opacity: 1 }, 200)

          // Auto hide toast
          setTimeout(() => {
            $(toast).animate({ opacity: 0 }, 200, function(){
              $(this).remove();
            });
          }, 3000);
        }

        //  Smooth transition links
        $(document).on('click', 'a[href^="#"]', function (event) {
          event.preventDefault();

          $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
          }, 500);
        });

        // Change url if not home
        if(window.location.pathname.length > 1){
          window.location.pathname = "/";
        }

    });
 })(jQuery);
