window.onload = function () {
    //burger
    $('.burger_menu').on('click', function(){
        $('body').toggleClass('menu_active');
    });

    // for partners
    // сликер для двух полосок картинок, причем они не должны листаться синхронно + они листаются автоматически
    let setTimer;
    const partners = document.querySelector('.autoplay').innerHTML;
    let start = false;
    function slicker() {
        let sl_w = $('.partner:eq(0)').width(),
            cols = Math.round(window.innerWidth/sl_w) + 2;
        for(let i = 0; i < Math.round(cols / 3) + 1; i++)
            $('.autoplay, .autoplay2').append(partners);
  
        console.log(cols)
        if (start) {
            $('.autoplay').slick('unslick');
            $('.autoplay2').slick('unslick');
        }
        
        $('.autoplay').slick({
            infinite: true,
            slidesToShow: cols,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            variableWidth: true
        });
        setTimeout(function(){
          $('.autoplay2').slick({
            infinite: true,
            slidesToShow: cols,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            variableWidth: true
          });
        },800);
  
        sl_w = $('.partner:eq(0)').width();
        $('#companies .slick:eq(0)').css('margin-left', -sl_w + "px");
        $('#companies .slick:eq(1)').css('margin-left', -(sl_w / 2) + "px");
    }
    slicker();
    start = true;
    window.addEventListener("resize", function () {
        clearTimeout(setTimer);
        setTimer = setTimeout(() => { slicker(); }, 500);
    });
  //

    // for tarifs
    // при наведении блок увеличивается
    $('.tarif_category:not(.active)').hover(function () {
      $('.tarif_category.active').removeClass('active');
    });
    $( ".tarif_category:not(.active)").on( "mouseleave", function() {
      $('.tarif_category:eq(1)').addClass('active');
    } );
  //

    // for reviews
    // для того чтобы какие-то отзывы показывались а какие-то нет + для подсчета там при пролистывании
    $(".a").css('height', $('.aa > div:eq(0)').height());
    function aa(p){
        console.log(p)
        $('.aa > div').css('opacity', '0');
        setTimeout(function(){ $('.aa > div').css('display', 'block'); }, 0);
        $('.aa > div:eq(' + p + ')').css('display', 'block');
        setTimeout(function(){ $('.aa > div:eq(' + p + ')').css('opacity', '1'); }, 0);
        
        setTimeout(function(){
            $(".a").animate({
                'height': $('.aa > div:eq(' + p + ')').height()
            }, 300, "linear");
        }, 100);
  
        $('.ednum').html((p+1).toString().padStart(2, '0'))
    }
  
    // для листалки
    p = 0, pl = $('.aa > div').length - 1;
    $('.b1').on('click', function(){
        if(p == 0) p = pl;
        else p--;
        aa(p);
    });
    $('.b2').on('click', function(){
  
        if(p == pl) p = 0;
        else p++;
        aa(p);
    });
  //

    // for FAQ
    $('#AskList > div').on('click', function(){
        $('#AskList > div').removeClass('active');
        $(this).addClass('active');
    });
  };
<script>
// Обработка отправки формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form_send');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('send');
    const captchaCheckbox = document.getElementById('captcha-checkbox');
    const agreeCheckbox = document.getElementById('oznakomlen');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Проверка чекбокса "Я не робот"
            if (!captchaCheckbox.checked) {
                showMessage('Пожалуйста, подтвердите, что вы не робот', 'error');
                captchaCheckbox.focus();
                return false;
            }
            
            // Проверка чекбокса согласия
            if (!agreeCheckbox.checked) {
                showMessage('Пожалуйста, отметьте согласие на обработку персональных данных', 'error');
                agreeCheckbox.focus();
                return false;
            }
            
            // Блокируем кнопку на время отправки
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(form);
                
                // Добавляем дополнительные данные
                formData.append('_replyto', document.getElementById('email').value);
                formData.append('agree', agreeCheckbox.checked ? 'Да' : 'Нет');
                formData.append('captcha', captchaCheckbox.checked ? 'Подтверждено' : 'Не подтверждено');
                
                // Отправка через Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showMessage('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                    form.reset();
                    
                    // Сбрасываем чекбоксы
                    captchaCheckbox.checked = false;
                    agreeCheckbox.checked = false;
                    
                    // Очистка через 5 секунд
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Ошибка отправки:', error);
                
                let userMessage = error.message;
                if (error.message.includes('Bad form post request')) {
                    userMessage = 'Неверный формат данных. Проверьте обязательные поля.';
                } else if (error.message.includes('Failed to fetch')) {
                    userMessage = 'Проблема с интернет-соединением.';
                }
                
                showMessage(`❌ ${userMessage}`, 'error');
            } finally {
                // Восстанавливаем кнопку
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Добавляем визуальный эффект при клике на чекбокс "Я не робот"
        captchaCheckbox.addEventListener('change', function() {
            const container = this.closest('.captcha-container');
            if (this.checked) {
                container.style.backgroundColor = '#e8f0fe';
                container.style.borderColor = '#4285f4';
            } else {
                container.style.backgroundColor = '#f8f9fa';
                container.style.borderColor = '#ddd';
            }
        });
    }
    
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = type;
        formMessage.style.display = 'block';
        formMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        formMessage.style.color = type === 'success' ? '#155724' : '#721c24';
        formMessage.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    }
});
</script>
